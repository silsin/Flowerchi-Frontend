# Flowerchi deployment

## One-command installation

1. Copy `.env.example` to `.env` and replace every placeholder. Generate long random values for `POSTGRES_PASSWORD` and `AUTH_SECRET` (at least 32 characters).
2. Set `DOMAIN`, `LETSENCRYPT_EMAIL`, and `NEXT_PUBLIC_APP_URL` to the public domain details. The Compose stack automatically configures Nginx, requests the initial Let's Encrypt certificate, and renews it.
3. Add the same callback address in Zarinpal: `https://panel.example.com/api/payments/zarinpal/callback`.
4. Start the stack:

   ```sh
   docker compose up -d --build
   ```

PostgreSQL is stored in the `postgres_data` Docker volume. Do not remove that volume unless the data should be permanently deleted.

By default, the application runs on host port `30003` and is intended to be proxied by an existing host Nginx. Use the configuration in `docker/host-nginx.conf`, then obtain or retain the host's HTTPS certificate. The optional Docker-managed Nginx and Certbot stack is available only when ports 80/443 are free: `docker compose --profile docker-edge up -d --build`.

## First administrator

On the first visit, the panel redirects to `/setup`. Enter the first administrator's name, email, and password there. The setup endpoint locks the users table, creates exactly one initial administrator, signs that administrator in, and refuses all future setup requests.

## Payment safety

Order amounts are stored in toman (IRT); the Zarinpal request and verification values are converted to rial. An order is marked `paid` only after Zarinpal's server-side verify response is successful. The callback must be publicly reachable over HTTPS.

## API overview

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET|POST /api/platforms`, `/api/categories`, `/api/services`
- `GET|POST /api/users`, `GET /api/orders`, `PATCH /api/orders/:id`
- `GET /api/dashboard`, `GET /api/analytics?days=30`, `GET|PUT /api/settings`
- `POST /api/checkout` and `GET /api/payments/zarinpal/callback`

## Client application API and Swagger

The client/mobile API is versioned under `/api/v1`. Customers authenticate with `POST /api/v1/auth/login` and send the returned access token as `Authorization: Bearer <token>` to `/api/v1/me` and `/api/v1/orders`. The active service catalog is public at `/api/v1/catalog`.

Interactive Swagger documentation is available at `/docs`; the machine-readable OpenAPI document is `/api/openapi.json`.

Administrative endpoints require the secure, HTTP-only session cookie issued by login. The checkout endpoint is intentionally public and rate-limited.
