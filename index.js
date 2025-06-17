import express from "express";
import crypto from "crypto";
import { createClient } from "redis";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import { apiAuth } from "./auth.js";

dotenv.config();
const app = express();
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
await redisClient.connect();
app.use(express.json());

const API_KEY = process.env.API_KEY; // Api Auth Key
app.use("/api/store", apiAuth(API_KEY));
app.use("/api/view", apiAuth(API_KEY));

app.post("/api/store", async (req, res) => {
  const { encryptedSecret, ttl, allowedIp, password } = req.body;

  if (!encryptedSecret) {
    return res.status(400).json({ error: "Missing encryptedSecret" });
  }

  const token = uuidv4();
  const expiry = ttl || 300;
  const key = `secret:${token}`;

  const hashedPassword =
    password != null
      ? crypto.createHash("sha256").update(String(password)).digest("hex")
      : null;

  const payload = JSON.stringify({
    encryptedSecret,
    allowedIp,
    password: hashedPassword,
  });

  try {
    await redisClient.setEx(key, expiry, payload);
    res.json({ link: `http://localhost:3001/api/view/${token}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to store secret" });
  }
});

/**
 * GET /api/view/:token
 * Retrieve and delete a one-time secret
 */
app.post("/api/view/:token", async (req, res) => {
  const token = req.params.token;
  const key = `secret:${token}`;
  const requestIp =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const providedPassword = req.body?.password || null;

  try {
    const raw = await redisClient.get(key);

    if (!raw) {
      return res
        .status(404)
        .json({ error: "Secret already viewed or expired" });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({ error: "Corrupted secret format" });
    }

    if (typeof data !== "object" || data === null) {
      return res.status(500).json({ error: "Invalid secret structure" });
    }

    const { encryptedSecret, allowedIp, password: storedHashedPassword } = data;

    if (allowedIp && allowedIp !== requestIp) {
      return res
        .status(403)
        .json({ error: "Access denied: IP address not allowed" });
    }

    if (storedHashedPassword) {
      if (!providedPassword) {
        return res.status(401).json({ error: "Password required" });
      }

      const hashedProvided = crypto
        .createHash("sha256")
        .update(String(providedPassword))
        .digest("hex");

      if (hashedProvided !== storedHashedPassword) {
        return res.status(403).json({ error: "Incorrect password" });
      }
    }

    await redisClient.del(key); // burn after reading
    res.json({ encryptedSecret });
  } catch (error) {
    console.error("Error retrieving secret:", error);
    res.status(500).json({ error: "Failed to retrieve secret" });
  }
});

app.listen(process.env.PORT);
