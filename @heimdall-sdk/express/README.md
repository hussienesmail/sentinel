# @heimdall-sdk/express

> **Requires Sentinel** — this middleware only works when a Sentinel instance is running. It sends request logs and metrics to Sentinel using a buffered, asynchronous mechanism.

Middleware for Express to send request logs and basic metrics to Sentinel with minimal overhead.

## Features

- Automatically logs incoming HTTP requests
- Sends logs and metrics to Sentinel asynchronously
- Buffered sending: flush when buffer reaches `flushSize` or after `flushIntervalMs`
- Identify services via `serviceName`
- API Key authentication support
- Non-blocking — does not delay request handling

## Installation

```bash
npm install @heimdall-sdk/express
```

## Usage

```typescript
import { heimdall } from "@heimdall-sdk/express";
import express from "express";

const app = express();
app.use(express.json());

app.use(
  heimdall({
    baseUrl: "http://localhost:8080", // Sentinel URL
    serviceName: "my-company-api",
    apiKey: "heim_XXXX", // Generated in Sentinel
    flushIntervalMs: 10000, // Optional (default: 10000)
    flushSize: 50, // Optional (default: 50)
    includeBody: false, // Optional (default: false)
    enabled: true, // Optional (default: true)
  })
);

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
```
