# URL Shortener Microservice

## Setup
1. Install Node.js and MongoDB.
2. Start MongoDB: `mongod`.
3. Backend: Navigate to `backend/`, run `npm install`, then `node server.js`.

## Testing
- Use POST /shorturls to create short links.
- Use GET /shorturls/:shortcode for stats.
- Access /:shortcode for redirection.

## Notes
- Expiry is calculated from the current time (02:59 PM IST, June 27, 2025).
- Replace `mongodb://localhost/urlshortener` with your MongoDB URI if needed.