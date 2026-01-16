# Sentinel's Journal

## 2025-02-12 - Insecure Default Fallbacks in Security Critical Functions
**Vulnerability:** The `hashIpAddress` function fell back to a hardcoded 'default-salt' when the `IP_SALT` environment variable was missing.
**Learning:** Developers often add "dev-friendly" defaults to avoid configuration friction, but these defaults can silently persist into production, compromising security (in this case, making IP hashes guessable).
**Prevention:** Fail securely. In production, throw an error if critical security configuration is missing. In development, warn loudly. Use strict environment variable access (like `$env/dynamic/private`) to ensure variables are loaded correctly.
