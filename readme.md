
# http-client-lab

A lightweight, tool-agnostic playground for practising HTTP clients (curl, HTTPie, Postman, etc.) against a simple Node + SQLite backend.
Perfect for learning HTTP verbs, headers, status codes, multipart file uploads, query params, and error handling — all with repeatable local setup.

---

## Quick project tree

```
.
├── database
│   ├── schema.sql
│   └── testlab.db
├── index.js
├── package.json
├── package-lock.json
└── src
    ├── app.js
    ├── config
    │   └── db.js
    ├── controllers
    │   ├── files.controller.js
    │   ├── posts.controller.js
    │   └── users.controller.js
    ├── middleware
    │   └── error.middleware.js
    ├── models
    │   ├── files.model.js
    │   ├── posts.model.js
    │   └── users.model.js
    ├── routes
    │   ├── files.routes.js
    │   ├── posts.routes.js
    │   └── users.routes.js
    └── uploads
```

---

## What this lab is for

* Practice CRUD with `GET`, `POST`, `PUT`, `DELETE`.
* Practice query parameters, filtering and simple relations.
* Practice multipart `file` uploads and file metadata endpoints.
* Compare output and ergonomics between curl, HTTPie, and `jq`.
* Experiment with error cases and edge conditions (unique constraints, missing records, invalid input).
* Quick to reset and extend — ideal for iterative learning.

---

## Getting started (local)

1. Clone / copy project to a folder.

2. Install dependencies:

```bash
npm install
```

3. Ensure database schema is applied (one-time):

```bash
sqlite3 database/testlab.db < database/schema.sql
```

> Note: the project `src/config/db.js` may be written to ensure the schema at startup automatically. If you see `SQLITE_ERROR: no such table`, run the command above or confirm the DB path is `database/testlab.db`.

4. Start the server:

```bash
# Direct
node index.js

# or, if you have a dev script using nodemon
npm run dev
```

5. Open a second terminal and start issuing requests (curl / HTTPie examples below).

---

## Environment & configuration

* Database path: `database/testlab.db` (relative to project root).
* Uploaded files are stored in: `src/uploads/` (this folder is generally `.gitignore`d).
* If you add `.env` values, make sure `src/config/db.js` reads them (dotenv).

---

## Database schema (tables)

The schema lives at `database/schema.sql`. Important tables:

### `users`

* `id` — integer primary key autoincrement
* `name` — text, required
* `email` — text, unique, required
* `age` — integer (optional)
* `created_at`, `updated_at` — timestamps

### `posts`

* `id` — integer primary key autoincrement
* `user_id` — integer FK → `users.id` (ON DELETE CASCADE)
* `title` — text required
* `body` — text
* `published` — boolean (0/1), default 0
* `created_at`, `updated_at` — timestamps

### `files`

* `id` — integer primary key autoincrement
* `original_name` — original filename
* `stored_name` — filename on disk
* `mime_type` — file mime type
* `size` — file size in bytes
* `uploaded_by` — optional `users.id`
* `created_at` — timestamp

(You can open `database/schema.sql` to see exact CREATE TABLE statements.)

---

## API endpoints (overview + examples)

> Replace `localhost:3000` with `HOST:PORT` if you changed it.

### Users

* `GET /users` — list users
* `GET /users/:id` — get user by id
* `POST /users` — create user
* `PUT /users/:id` — update user
* `DELETE /users/:id` — delete user

**curl examples**

```bash
# Create
curl -s -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Yash","email":"yash@test.com","age":25}' | jq

# Get all
curl -s http://localhost:3000/users | jq

# Get single
curl -s http://localhost:3000/users/1 | jq

# Update
curl -s -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Yash Updated","email":"yash@test.com","age":26}' | jq

# Delete
curl -s -X DELETE http://localhost:3000/users/1 | jq
```

**HTTPie examples**

```bash
http POST :3000/users name="Yash" email="yash@test.com" age:=25
http :3000/users
http PUT :3000/users/1 name="Yash Updated" age:=26
```

> HTTPie automatically pretty-prints JSON and colors output.

---

### Posts

* `GET /posts` — list posts; supports query filters, e.g. `?user_id=1` or `?published=1`
* `POST /posts` — create post (body: `user_id`, `title`, `body`, `published`)

**curl example**

```bash
curl -s -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"user_id":1,"title":"Hello","body":"Curl is powerful","published":0}' | jq

curl -s "http://localhost:3000/posts?user_id=1&published=1" | jq
```

---

### Files (upload)

* `POST /files` — multipart upload. Field name for file: `file`. You can include `uploaded_by` as a form field.

**curl example**

```bash
curl -s -X POST http://localhost:3000/files \
  -F "file=@/path/to/local-image.png" \
  -F "uploaded_by=1" | jq
```

**HTTPie example**

```bash
http -f POST :3000/files file@/path/to/local-image.png uploaded_by:=1
```

Uploaded files are saved under `src/uploads`. The DB stores metadata; you can implement a download endpoint if desired.

---

## Response formatting & pretty output

* Recommended: install `jq` for curl:

  ```bash
  # Ubuntu
  sudo apt install jq

  # macOS
  brew install jq
  ```

  Then: `curl ... | jq`

* Alternative (if `jq` not available): `curl ... | python3 -m json.tool`

* HTTPie already pretty-prints and colorizes JSON by default.

* Optional server-side helper: set `app.set('json spaces', 2);` in `src/app.js` to indent JSON responses in development.

---

## Troubleshooting & common gotchas

* **`SQLITE_ERROR: no such table`**

  * Ensure `database/testlab.db` contains tables. Run:

    ```bash
    sqlite3 database/testlab.db
    .tables
    ```

    If empty, apply schema:

    ```bash
    sqlite3 database/testlab.db < database/schema.sql
    ```

* **Nodemon starting wrong file (e.g. index.js vs src/server.js)**

  * Check `package.json` `scripts.dev` and `nodemon.json` (if present). Start server with the correct entry: `node index.js` or `npm run dev`.

* **Uploads not appearing**

  * Check `src/uploads` permissions and ensure multer `destination` points there.

* **`db` undefined`or`db.run is not a function`**

  * This happens if DB client isn't initialized before models try to use it. Ensure `src/config/db.js` initializes the DB before handling requests (either auto-apply schema on require, or use explicit `connectDB()` on startup and ensure models call `getDB()` lazily at runtime).

---

## Testing & reset helpers

* Reset DB (wipe and re-create schema):

```bash
rm database/testlab.db
sqlite3 database/testlab.db < database/schema.sql
```

* Seed data (you can add simple `seed.sql` and run `sqlite3 database/testlab.db < database/seed.sql`).

* Add a `/reset-db` endpoint for convenience (only for a local lab, not production).

---

## Suggested exercises (practice list)

1. Use `curl` and `jq` to create 5 users, then query `/users` and filter in the shell.
2. Create posts for different users; list posts by `user_id`.
3. Upload files and verify metadata stored in `files` table.
4. Simulate error cases: create user with duplicate email; fetch non-existent user.
5. Implement pagination (`?limit=&offset=`) on `/users` or `/posts`.
6. Add a `PATCH /users/:id` route for partial updates.
7. Add simple API-key auth to practice headers: `-H "x-api-key: test123"`.
8. Add tests using `supertest` to validate endpoints automatically.

---

## Extending the lab (ideas)

* Add OpenAPI / Swagger docs and a `/docs` endpoint.
* Add Dockerfile + docker-compose to containerize the lab.
* Add CI workflow to run tests on PR.
* Add a small frontend (optional) to visualize posts/files/users.
* Add authentication (JWT / API keys) and rate limiting for experimentation.

---

## Contributing

This repo is meant to be flexible — feel free to:

* add new routes and experiments,
* create `examples/` with common curl/httpie snippets,
* add `seed.sql` and `reset` scripts.

If you want, I can:

* write a `curl-commands.md` with many example commands,
* add a `/reset-db` endpoint for easier testing,
* add OpenAPI spec and generator.

---

## License

Use as you wish — MIT-style in spirit. This is a personal learning sandbox.

---

If you want, I’ll:

* create a `curl-commands.md` with ready-to-run commands,
* add a `dev` script in `package.json` and a `nodemon.json` stub,
* or write a short `/docs` endpoint that lists the available routes and example requests.

Which of those would you like next?
