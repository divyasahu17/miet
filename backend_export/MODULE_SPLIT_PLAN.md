# Backend Module Split Plan

This project is currently a single large server file in [index.js](index.js). The goal of this plan is to split it into small modules without changing behavior until each piece is verified.

## Current State

- [index.js](index.js) contains app bootstrap, middleware, uploads, auth, schema creation, and most routes.
- [routes/orders.js](routes/orders.js) is not wired into the app and still uses CommonJS.
- [db.js](db.js) is empty, so any route importing it will fail.
- The current app already uses ESM, so new modules should use `import` / `export` only.

## Target Structure

```text
src/
  app.js
  server.js
  config/
    env.js
    cors.js
    uploads.js
    providers.js
  db/
    sqlite.js
    schema.js
    migrations.js
  middleware/
    auth.js
    errors.js
    rateLimiters.js
  routes/
    auth.routes.js
    admin.routes.js
    users.routes.js
    consultants.routes.js
    services.routes.js
    products.routes.js
    orders.routes.js
    payments.routes.js
    blogs.routes.js
    gallery.routes.js
    team.routes.js
    programmes.routes.js
    cms.routes.js
    index.js
  services/
    supabase.service.js
    google.service.js
    razorpay.service.js
    mail.service.js
    upload.service.js
  utils/
    logger.js
    asyncHandler.js
    validation.js
```

## Safe Split Order

1. Create a shared database module first.
   - Move SQLite connection code into `src/db/sqlite.js`.
   - Keep the same database file and schema so data is not lost.
   - Export a single `db` instance and a `setupDatabase()` function.

2. Extract config and startup wiring.
   - Move env parsing, CORS config, and provider setup into `src/config/*`.
   - Keep `dotenv.config()` in the bootstrap layer only.

3. Split middleware next.
   - Move JWT/auth helpers into `src/middleware/auth.js`.
   - Move rate-limiters and error handlers out of the server file.

4. Move only one route group at a time.
   - Start with a low-risk group such as blogs or CMS.
   - Mount the route in `src/routes/index.js`.
   - Verify behavior before moving the next group.

5. Migrate ecommerce last.
   - Orders and payments are tightly coupled to schema, inventory, and auth.
   - Move them only after the shared database layer is stable.

6. Leave the old server file as a thin bootstrap.
   - `index.js` should eventually only import `app` from `src/app.js`, call `setupDatabase()`, and start listening.

## What to Fix Before Splitting

- `routes/orders.js` should be rewritten to ESM or deleted.
- `db.js` should either export the database connection or be removed.
- The `/submit-form` handler must match the `users` schema.
- Any direct `require()` calls inside `index.js` must be converted to ESM imports.

## Recommended First Cut

1. Create `src/db/sqlite.js` and move connection logic there.
2. Create `src/app.js` and move Express setup, middleware, and static uploads there.
3. Create `src/routes/index.js` and mount one route module at a time.
4. Keep `index.js` as the only executable entrypoint until all routes are verified.

## Rollback Rule

If any extracted route fails, restore the old route registration in `index.js` before moving on. That keeps the refactor reversible and avoids a broken server state.