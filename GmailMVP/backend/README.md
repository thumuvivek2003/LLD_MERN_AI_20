# Gmail MVP — Backend

LLD learning project: a Gmail-style mail backend built as a **feature-based modular monolith** with classic design patterns (Factory, Strategy, Observer, Singleton).

Stack: **Node.js (ESM) + Express + MongoDB (Mongoose) + Socket.IO**.

See [`../API_CONTRACT.md`](../API_CONTRACT.md) for the shared REST/DTO/socket contract with the frontend.

## Prerequisites
- Node.js 18+ (ESM, `"type": "module"`)
- A local MongoDB running at `mongodb://127.0.0.1:27017` (database `gmail_mvp`)
  - macOS (Homebrew): `brew services start mongodb-community` or run `mongod --dbpath <path>`

## Setup
```bash
cd backend
npm install
```

`.env` is committed (learning project) with:
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/gmail_mvp
CLIENT_ORIGIN=http://localhost:5173
```

## Run
```bash
npm run dev     # nodemon (auto-reload)
npm start       # plain node
```

On startup the server:
1. Registers the Observer subscribers (thread / index / socket).
2. Connects to MongoDB. **If MongoDB is unavailable it logs a clear message and still listens** (DB-backed routes will error until Mongo is up) — no crash-loop.
3. Seeds 5 users + sample conversations **if the DB is empty**.
4. Builds the in-memory inverted-index search index.
5. Listens on `http://localhost:4000`.

## Quick smoke test
```bash
curl http://localhost:4000/health
curl http://localhost:4000/api/users
# grab two user ids from above, then:
curl -X POST http://localhost:4000/api/mails/send \
  -H 'Content-Type: application/json' \
  -d '{"senderId":"<ALICE_ID>","to":["<BOB_ID>"],"subject":"Hello","body":"Hi Bob"}'
curl "http://localhost:4000/api/mails/inbox?userId=<BOB_ID>"
curl "http://localhost:4000/api/search?userId=<ALICE_ID>&q=hello&type=all"
```

## REST endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/users` | all users |
| GET | `/api/users/:id` | one user |
| POST | `/api/mails/send` | `{ senderId, to[], subject, body }` |
| GET | `/api/mails/inbox?userId=` | newest first |
| GET | `/api/mails/sent?userId=` | newest first |
| GET | `/api/mails/:id?userId=` | marks read for that user |
| POST | `/api/mails/:id/reply` | `{ senderId, body }` |
| GET | `/api/threads/:id` | full conversation (oldest first) |
| GET | `/api/search?userId=&q=&type=` | type = all\|from\|to\|subject\|body |

All responses use the envelope `{ success, data }` or `{ success, error: { message, code } }`.

## Socket.IO
- Client emits `user:join` `{ userId }` to join its room.
- Server emits `mail:received` (a `MailDTO`) to each receiver's room on send/reply.

## Architecture / patterns
- **Factory** — `shared/factory/mail.factory.js` builds mail/reply payloads.
- **Strategy** — `shared/strategy/*` inverted-index (default) + substring search strategies behind a `SearchContext`.
- **Observer / pub-sub** — `MailService.send()` persists then publishes `mail.sent` on the `EventBus` singleton. Independent subscribers create/append the thread, update the search index, and emit the socket event.
- **Singleton** — `EventBus` and `SocketManager` shared instances.

### Send flow
```
POST /api/mails/send
  -> MailService.send()
       -> MailFactory.createMail()
       -> mailRepository.save()
       -> EventBus.publish('mail.sent', { mail, isReply })
            -> thread.subscriber  : create/append Thread
            -> index.subscriber   : add mail to inverted index
            -> socket.subscriber  : emit 'mail:received' to each receiver room
```

## Project structure
```
src/
  app.js                 createExpressApp()
  server.js              startServer() (entry)
  config/                env, db, socket, seed
  shared/
    constants/           mail-status, socket-events, search-types
    utils/               tokenizer, response, async-handler, app-error
    middleware/          error, not-found
    singleton/           socket-manager, event-bus
    factory/             mail.factory
    strategy/            search-strategy, inverted-index, substring, search-context
    observer/            events + subscribers (index, thread, socket)
  modules/
    user/  mail/  thread/  search/   (routes, controller, service, repository, model, mapper)
```

## Notes / caveats
- Requires a local MongoDB. Without it the server boots but DB routes fail.
- The search index is **in-memory**; it is rebuilt from MongoDB on every startup and kept fresh by the index subscriber on each send.
- Thread creation is driven by the Observer subscriber and completes asynchronously right after send (eventual consistency within the same request lifecycle).
