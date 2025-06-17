# 🔥 OneBurn

**OneBurn** is a simple yet powerful open-source API that allows you to generate **one-time self-destructing links** for sensitive secrets (passwords, tokens, notes, etc.). Secrets can be optionally protected with an IP address and a password.

> 📦 Lightweight | 🔒 Secure | 🧨 Burn-After-Read | ☁️ Redis-backed

---

## 🌐 Live Demo

Coming soon…

---

## 🚀 Features

* 🔐 One-time viewing — auto-deletes secret after first access.
* 🌍 IP restriction — allow viewing from a specific IP only.
* 🔑 Password protection — require password to unlock secret.
* ⏱️ TTL (Time-to-Live) — secret automatically expires.
* ⚡ Fast, stateless API using Redis.
* 🧱 Built with Node.js + Express + Redis.

---

## 📦 API Endpoints

### ➕ POST `/api/store`

Store a secret and generate a one-time link.

#### Request Body

```json
{
  "encryptedSecret": "your-encrypted-data",
  "ttl": 300,
  "allowedIp": "123.123.123.123(optional ip)",
  "password": "optionalPassword"
}
```

| Field           | Type   | Description                                        |
| --------------- | ------ | -------------------------------------------------- |
| encryptedSecret | string | The encrypted secret to store (required)           |
| ttl             | number | Time-to-live in seconds (optional, default 300)    |
| allowedIp       | string | IP address allowed to access the secret (optional) |
| password        | string | Password required to unlock the secret (optional)  |

#### Response

```json
{
  "link": "http://localhost:3001/api/view/your-token"
}
```

---

### 👁️ POST `/api/view/:token`

Retrieve and delete a one-time secret.

#### Request Body

```json
{
  "password": "optionalPassword"
}
```

| Field    | Type   | Description                                       |
| -------- | ------ | ------------------------------------------------- |
| password | string | Required only if the secret is password protected |

#### Success Response

```json
{
  "encryptedSecret": "your-encrypted-data"
}
```

#### Error Responses

| Code | Message                                  |
| ---- | ---------------------------------------- |
| 404  | Secret already viewed or expired         |
| 403  | IP address not allowed or wrong password |
| 401  | Password required                        |
| 500  | Server/internal error                    |

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```
PORT=3001
API_KEY=your_super_secret_api_key
REDIS_URL=redis://localhost:6379
```

* `API_KEY`: Required for API authentication.
* `REDIS_URL`: (Optional) Redis Cloud or local instance.

---

## 🛠️ Installation & Running

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/oneburn.git
cd oneburn
npm install
cp .env.example .env
```

### 2. Configure `.env`

Edit `.env` with your own values for `API_KEY`, `PORT`, and optionally `REDIS_URL`.

### 3. Start the Server

```bash
npm start
```

Server runs at `http://localhost:3001`

---

## 🔐 Authentication

All API requests must include the API key in headers:

```
Authorization: Bearer your_api_key
```

---

## 📁 File Structure

```
oneburn/
├── auth.js
├── server.js
├── .env
├── .gitignore
├── README.md
└── package.json
```

---

## 🧪 Example Usage with cURL

### Store Secret

```bash
curl -X POST http://localhost:3001/api/store \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"encryptedSecret":"hello world","ttl":600,"password":"1234"}'
```

### View Secret

```bash
curl -X POST http://localhost:3001/api/view/<token> \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"password":"1234"}'
```

---

## 🧰 Tech Stack

* Node.js
* Express.js
* Redis (Cloud or Local)
* dotenv
* uuid
* crypto

---

## 🤝 Contributing

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 🧾 License

**MIT License**

```
MIT License

Copyright (c) 2025 AdhwaithAS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---
