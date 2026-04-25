#!/usr/bin/env python3
"""
Dev server for Bitcoin Sovereign Academy — like `python3 -m http.server` but
forces fresh fetches on every request so edits to /js/ and /css/ show up
immediately during local verification.

Browsers heuristically cache responses without Cache-Control. SimpleHTTPRequestHandler
sends none, so a stale /js/bitcoin-data-reliable.js can sit in cache for a long time.
This subclass adds:
  Cache-Control: no-store, no-cache, must-revalidate, max-age=0
  Pragma: no-cache
  Expires: 0

Run via .claude/launch.json — see the "static" configuration.
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5178
    with ThreadingHTTPServer(("", port), NoCacheHandler) as httpd:
        print(f"Serving (no-cache) on http://localhost:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down")


if __name__ == "__main__":
    main()
