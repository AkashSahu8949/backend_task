# Redis Pub/Sub Microservices with MongoDB

## Overview

This project demonstrates a simple Pub/Sub microservice architecture using Redis and MongoDB. It includes two services:

1. **Receiver Service**: Accepts user data via a POST endpoint, validates and stores it in MongoDB, and then publishes the data to Redis.
2. **Listener Service**: Subscribes to Redis events and stores received data into a second MongoDB collection with an additional `modified_at` timestamp.

---

## Tech Stack

- Node.js
- Express
- MongoDB (with Mongoose)
- Redis
- Docker & Docker Compose
- Joi for validation
- UUID for unique IDs

---

## How It Works

- A POST request is sent to `/receiver` with user data (name, class, age, email).
- The receiver service validates and stores the data, then publishes it to Redis.
- The listener service listens to Redis events, processes the data, adds a `modified_at` timestamp, and saves it to its own database.

---

## API Endpoint

**POST** `/receiver`

**Request Body:**
```json
{
  "user": "Harry",
  "class": "Comics",
  "age": 22,
  "email": "harry@potter.com"
}
