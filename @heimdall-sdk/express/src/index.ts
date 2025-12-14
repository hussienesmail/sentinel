import type { NextFunction, Request, Response } from "express";
import { buildLog, type LogEntry } from "./entry.dto.js";

export interface LoggerOptions {
  enabled?: boolean;
  includeBody?: boolean;
  baseUrl: string;
  serviceName: string;
  apiKey: string;
  flushIntervalMs?: number;
  flushSize?: number;
  maxBufferSize?: number;
  developerMode?: boolean;
}

const MAX_BUFFER_SIZE = 5_000;

export function heimdall(options: LoggerOptions) {
  const {
    enabled = true,
    includeBody = false,
    apiKey,
    baseUrl,
    serviceName,
    flushIntervalMs = 10_000,
    flushSize = 50,
    maxBufferSize = MAX_BUFFER_SIZE,
    developerMode = false,
  } = options;

  if (!baseUrl) {
    console.warn("[heimdall-sdk] baseUrl is required.");
  }

  const flusher = createBufferFlusher(
    baseUrl,
    apiKey,
    flushSize,
    flushIntervalMs,
    maxBufferSize,
    developerMode
  );

  return (req: Request, res: Response, next: NextFunction) => {
    if (!enabled) return next();

    const start = Date.now();

    res.on("finish", () => {
      if (!baseUrl) return;

      const duration = Date.now() - start;

      const entry = buildLog(req, res, duration, includeBody, serviceName);

      flusher.add(entry, developerMode);
    });

    next();
  };
}

function createBufferFlusher(
  baseUrl: string,
  apiKey: string,
  flushSize: number,
  flushIntervalMs: number,
  maxBufferSize: number,
  developerMode = false
) {
  let buffer: LogEntry[] = [];
  let flushing = false;
  let failureCount = 0;
  const MAX_FAILURES = 5;

  const flushBuffer = async (developerMode: boolean) => {
    if (flushing) return;
    if (buffer.length === 0) return;

    flushing = true;

    const toSend = buffer.splice(0, flushSize);

    try {
      console.log("[heimdall-sdk] sending", toSend.length, "log entries");

      let url = `${baseUrl}/api/requests`;
      if (developerMode) {
        url = `${baseUrl}/requests`;
      }

      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-KEY": apiKey },
        body: JSON.stringify({
          logs: toSend,
        }),
      });

      failureCount = 0;
    } catch (err) {
      console.error("[heimdall-sdk] failed to send log:", err);
      failureCount++;

      if (
        failureCount <= MAX_FAILURES &&
        buffer.length + toSend.length <= maxBufferSize
      ) {
        buffer.unshift(...toSend);
      } else {
        console.warn(
          "[heimdall-sdk] too many failures or buffer full, dropping logs"
        );
      }
    }

    flushing = false;
  };

  const intervalId = setInterval(
    () => flushBuffer(developerMode),
    flushIntervalMs
  );

  const add = (entry: LogEntry, developerMode: boolean) => {
    if (buffer.length >= maxBufferSize) {
      console.warn("[heimdall-sdk] log buffer full, dropping log entry", entry);
      return;
    }

    buffer.push(entry);
    if (buffer.length >= flushSize) {
      flushBuffer(developerMode);
    }
  };

  const cleanup = () => {
    clearInterval(intervalId);
  };

  return { add, cleanup };
}
