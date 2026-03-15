# 🔗 MERN URL Shortener

A **production-style URL Shortener built with the MERN stack** demonstrating scalable backend architecture and clean modular frontend design.

The system converts **long URLs into short links**, supports **fast redirects**, and includes **caching, rate limiting, analytics tracking, and background processing** similar to systems like Bitly.

---

# 🚀 Features

### Core Features

* Shorten long URLs into compact links
* Redirect users instantly to the original URL
* URL expiration support
* Click tracking and analytics

### Production-Level Enhancements

* Redis caching for fast redirects
* Distributed short code generation
* Rate limiting to prevent abuse
* Background analytics pipeline
* Worker queue processing

---

# 🧱 Architecture

High-level system flow:

User → API → Cache → Database → Queue → Worker

```
User
 ↓
Express API
 ↓
Rate Limiter
 ↓
URL Service
 ↓
Redis Cache
 ↓
MongoDB
 ↓
Analytics Queue
 ↓
Worker
 ↓
Analytics Storage
```

---

# 🗂 Project Structure

```
url-shortener
│
├── backend
│   └── src
│       ├── controllers
│       ├── services
│       ├── repositories
│       ├── models
│       ├── utils
│       ├── middleware
│       ├── config
│       ├── queues
│       ├── workers
│       └── routes
│
└── frontend
    └── src
        ├── api
        ├── services
        ├── hooks
        ├── pages
        ├── components
        ├── utils
        └── constants
```

---

# ⚙️ Tech Stack

### Backend

* Node.js
* Express
* MongoDB
* Redis
* BullMQ (Worker Queue)

### Frontend

* React
* Axios
* Custom Hooks

---

# 📡 API Endpoints

### Create Short URL

POST `/shorten`

```
{
  "longUrl": "https://example.com"
}
```

Response

```
{
  "shortUrl": "http://localhost:5000/Ab3d9",
  "shortCode": "Ab3d9"
}
```

---

### Redirect

GET `/:shortCode`

Redirects user to the original URL.

---

### Analytics

GET `/analytics/:shortCode`

Returns click statistics.

---

# ⚡ Performance Optimizations

### Redis Cache

Stores frequently accessed mappings.

```
shortCode → longUrl
```

Avoids repeated database lookups.

---

### Rate Limiting

Protects API from spam requests.

Example limit:

```
100 requests / 15 minutes per IP
```

---

### Background Analytics

Click events are processed asynchronously.

```
Redirect
 ↓
Queue
 ↓
Worker
 ↓
Database
```

Ensures redirect latency stays low.

---


# 🌍 Example Flow

1. User submits long URL
2. System generates short code
3. Mapping stored in MongoDB
4. Redis caches frequently accessed URLs
5. Redirect happens instantly
6. Analytics processed asynchronously

---

# 📈 Scalability Design

This project demonstrates concepts used in large-scale systems:

* Distributed ID generation
* Cache-first read architecture
* Queue-based background processing
* Modular service layer

---

# 🧠 Learning Outcomes

Building this project helps understand:

* Low Level Design in real systems
* Scalable backend architecture
* Caching strategies
* Worker queues and async processing
* Clean MERN project structure

---

# 🏗 Future Improvements

* Redis cluster
* URL abuse detection
* Custom short links
* Analytics dashboard with charts
* CDN edge caching
* Distributed database sharding

---

# 👨‍💻 Author

Built as a **system design learning project using the MERN stack** to understand how production URL shortening systems work.
