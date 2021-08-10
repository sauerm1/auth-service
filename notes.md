- [x] /health API
- [x] /signup save username password
- [x] /login return access/refresh tokens
- [x] /validate takes access token, returns user ID
- [x] /refresh takes refresh token, returns new refresh/access tokens
- [x] /passwordResetRequest takes email sends forgot password link
    - [ ] set 5 minute wait time for reset password
- [ ] setup https https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/


connect to sqlite DB:
sqlite3 sqlite_db/auth.sqlite


JEST:
https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test