import { whiteLabelManager, EXAMPLE_TENANTS } from '../frontend/public/js/utils/white-label.js';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function testDetection() {
  Object.values(EXAMPLE_TENANTS).forEach((tenant) => {
    const detected = whiteLabelManager.detectTenantFromHostname(tenant.domain);
    assert(detected && detected.id === tenant.id, `Failed to detect tenant for domain ${tenant.domain}`);
  });
}

function testActiveTenant() {
  whiteLabelManager.setActiveTenant('school');
  const current = whiteLabelManager.getCurrentTenant();
  assert(current && current.id === 'school', 'Active tenant mismatch');
  const css = whiteLabelManager.generateThemeCSS();
  assert(css.includes('--brand-primary'), 'Generated CSS missing brand tokens');
}

function testEnvGeneration() {
  const env = whiteLabelManager.generateEnvFile('enterprise');
  assert(env.includes('TENANT_ID=enterprise'), 'Env file missing tenant id');
  assert(env.includes('ORG_NAME=Corporate Bitcoin Training'), 'Env file missing org name');
}

function run() {
  testDetection();
  testActiveTenant();
  testEnvGeneration();
  console.log('✅ Multi-tenant toolkit passed smoke tests');
}

run();
