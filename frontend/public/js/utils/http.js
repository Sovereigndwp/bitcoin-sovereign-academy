import axios from 'axios';
import { logger } from './logger.js';
export class HttpClient {
    constructor(config = {}) {
        this.retries = config.retries || 3;
        this.retryDelay = config.retryDelay || 1000;
        this.client = axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 10000,
            headers: {
                'User-Agent': 'MCP-Agent-Kit/1.0.0',
                'Accept': 'application/json',
                ...config.headers,
            },
        });
        // Add request interceptor for logging
        this.client.interceptors.request.use((config) => {
            logger.debug(`HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        }, (error) => {
            logger.error('HTTP Request Error:', error);
            return Promise.reject(error);
        });
        // Add response interceptor for logging
        this.client.interceptors.response.use((response) => {
            logger.debug(`HTTP Response: ${response.status} ${response.config.url}`);
            return response;
        }, (error) => {
            logger.error('HTTP Response Error:', {
                url: error.config?.url,
                status: error.response?.status,
                message: error.message,
            });
            return Promise.reject(error);
        });
    }
    async get(url, config) {
        return this.request('GET', url, config);
    }
    async post(url, data, config) {
        return this.request('POST', url, { ...config, data });
    }
    async put(url, data, config) {
        return this.request('PUT', url, { ...config, data });
    }
    async delete(url, config) {
        return this.request('DELETE', url, config);
    }
    async request(method, url, config) {
        let lastError;
        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await this.client.request({
                    method,
                    url,
                    ...config,
                });
                return response.data;
            }
            catch (error) {
                lastError = error;
                // Don't retry on client errors (4xx)
                if (error.response?.status >= 400 && error.response?.status < 500) {
                    throw error;
                }
                // Don't retry on last attempt
                if (attempt === this.retries) {
                    throw error;
                }
                // Wait before retrying
                await this.sleep(this.retryDelay * Math.pow(2, attempt));
                logger.warn(`Retrying request (attempt ${attempt + 1}/${this.retries + 1}): ${url}`);
            }
        }
        throw lastError;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
// Create default HTTP client instances
export const mempoolClient = new HttpClient({
    baseURL: process.env.MEMPOOL_API_URL || 'https://mempool.space/api',
    timeout: 15000,
});
export const coingeckoClient = new HttpClient({
    baseURL: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    timeout: 15000,
});
export const githubClient = new HttpClient({
    baseURL: 'https://api.github.com',
    timeout: 15000,
    headers: process.env.GITHUB_TOKEN ? {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
    } : {},
});
// Export default client for general use
export const httpClient = new HttpClient();
