#!/usr/bin/env python3
"""
HTTPS Development Server for Bitcoin Sovereign Academy
Creates a self-signed certificate and serves the site over HTTPS
"""

import http.server
import ssl
import os
import tempfile
from pathlib import Path

# Generate a self-signed certificate for development
def create_self_signed_cert():
    """Create a temporary self-signed certificate for development"""
    from cryptography import x509
    from cryptography.x509.oid import NameOID
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.backends import default_backend
    from cryptography.hazmat.primitives.asymmetric import rsa
    from cryptography.hazmat.primitives import serialization
    import datetime
    
    # Generate private key
    key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    
    # Create certificate
    subject = issuer = x509.Name([
        x509.NameAttribute(NameOID.COMMON_NAME, "localhost"),
        x509.NameAttribute(NameOID.ORGANIZATION_NAME, "Bitcoin Sovereign Academy"),
    ])
    
    cert = x509.CertificateBuilder().subject_name(
        subject
    ).issuer_name(
        issuer
    ).public_key(
        key.public_key()
    ).serial_number(
        x509.random_serial_number()
    ).not_valid_before(
        datetime.datetime.utcnow()
    ).not_valid_after(
        datetime.datetime.utcnow() + datetime.timedelta(days=365)
    ).add_extension(
        x509.SubjectAlternativeName([
            x509.DNSName("localhost"),
            x509.DNSName("127.0.0.1"),
        ]),
        critical=False,
    ).sign(key, hashes.SHA256(), default_backend())
    
    # Write to temp files
    cert_file = tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.pem')
    key_file = tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.pem')
    
    cert_file.write(cert.public_bytes(serialization.Encoding.PEM))
    key_file.write(key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption()
    ))
    
    cert_file.close()
    key_file.close()
    
    return cert_file.name, key_file.name

def run_https_server(port=8443):
    """Run HTTPS server with self-signed certificate"""
    try:
        # Try to create certificate with cryptography library
        cert_file, key_file = create_self_signed_cert()
        print(f"✅ Created self-signed certificate")
    except ImportError:
        print("⚠️  Cryptography library not installed. Using simpler method...")
        # Fallback: create using openssl command
        import subprocess
        cert_file = '/tmp/cert.pem'
        key_file = '/tmp/key.pem'
        subprocess.run([
            'openssl', 'req', '-x509', '-newkey', 'rsa:4096',
            '-keyout', key_file, '-out', cert_file,
            '-days', '365', '-nodes', '-subj',
            '/CN=localhost/O=Bitcoin Sovereign Academy'
        ], capture_output=True)
    
    # Create HTTPS server
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)
    
    # Wrap with SSL
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(cert_file, key_file)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    
    print(f"""
╔════════════════════════════════════════════════════════════════╗
║                 Bitcoin Sovereign Academy                      ║
║                    HTTPS Development Server                    ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  🔐 Server running at: https://localhost:{port}                ║
║                                                                ║
║  📍 Access the game at:                                       ║
║     https://localhost:{port}/interactive-demos/               ║
║     bitcoin-sovereign-game.html                               ║
║                                                                ║
║  ⚠️  Note: Browser will warn about self-signed certificate    ║
║     Click "Advanced" → "Proceed to localhost" to continue     ║
║                                                                ║
║  Press Ctrl+C to stop the server                              ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
        # Clean up temp files
        if os.path.exists(cert_file):
            os.unlink(cert_file)
        if os.path.exists(key_file):
            os.unlink(key_file)

if __name__ == "__main__":
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8443
    run_https_server(port)