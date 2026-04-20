Question to Copilot: How can I identify the user associated with a client call to the back end without the front end telling the back end?

Short answer: you can’t identify a user from a browser request with _zero_ client-provided data.  
The backend must receive some credential, but it should be an unforgeable one, not a user ID from frontend code.

Best practice is:

1. User authenticates once (password/OAuth/etc.).
2. Backend issues a secure credential:
   - `HttpOnly` `Secure` session cookie (recommended for web apps), or
   - signed access token (JWT).
3. Browser sends that credential automatically on each request.
4. Backend validates it and resolves the user server-side.

What this gives you:

- Frontend never sends `userId` directly.
- Backend decides identity from validated session/token claims.
- User spoofing via “I am user 123” is prevented.

Recommended setup for a browser app:

- Use server-side sessions + `HttpOnly`, `Secure`, `SameSite` cookies.
- Store `sessionId -> userId` in Redis/DB.
- On each request: read cookie, validate session, attach `req.user`.
- Ignore any user identifiers from request body/query for auth decisions.

Important hardening:

- Always use HTTPS.
- Add CSRF protection if using cookies.
- Verify token signature/expiry/audience if using JWT.
- At API gateway/proxy, only trust identity headers if they are injected internally (never from public clients).

If you want, I can sketch an Express middleware example for cookie-session auth in your stack.
