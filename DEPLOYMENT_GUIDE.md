# 🚀 e-AROGYATA Live Deployment Guide

This guide provides step-by-step instructions to deploy the **e-AROGYATA — Smart Hospital Platform** live on cloud platforms (Render, Railway, Vercel, or Docker).

---

## 🟢 Option 1: Render.com (Recommended Free Cloud Hosting)

Render provides free hosting for full-stack Node.js web applications with automatic HTTPS certificates and zero configuration.

### Steps to Deploy:
1. **Push your updated repository to GitHub**:
   ```bash
   git add .
   git commit -m "Add full-stack REST backend, SQLite persistence, and deployment configs"
   git push origin main
   ```
2. **Log into Render**: Go to [https://render.com](https://render.com) and create a free account.
3. **Create a New Web Service**:
   - Click **New +** -> **Web Service**.
   - Connect your GitHub repository `Harsh-9110/e-AROGYATA`.
4. **Configure Settings**:
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. **Deploy**: Click **Create Web Service**. Your platform will be live in 1-2 minutes with a free `.onrender.com` domain!

---

## 🟣 Option 2: Railway.app (Instant 1-Click Deployment)

Railway automatically detects the `Dockerfile` and `package.json` in the root directory.

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select `Harsh-9110/e-AROGYATA`.
4. Railway will automatically build the container and generate a live public URL.

---

## 🐳 Option 3: Docker / VPS Container Deployment

If you want to run e-AROGYATA on an AWS EC2, DigitalOcean droplet, or self-hosted server:

```bash
# Build Docker image
docker build -t earogyata-platform .

# Run container on port 5000
docker run -d -p 5000:5000 --name earogyata earogyata-platform
```

Or using Docker Compose:
```bash
docker-compose up -d
```

---

## 💻 Option 4: Local Live Testing

To run the platform locally on your computer:

```bash
# Start backend server
npm start

# Open in browser:
http://localhost:5000
```

---

## 📊 Live Backend API Endpoints

Once deployed, your live platform exposes the following REST APIs:

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Server health status |
| `/api/auth/signup` | POST | User registration (Patients/Doctors) |
| `/api/auth/login` | POST | Login and JWT token issuance |
| `/api/doctors` | GET | Doctor catalog with specialty filter |
| `/api/appointments/book` | POST | Schedule appointment & issue OPD queue token |
| `/api/opd/status` | GET | Live OPD queue wait-time optimization |
| `/api/beds` | GET | Real-time bed counter per ward |
| `/api/beds/book` | POST | Instant bed reservation |
| `/api/pharmacy/medicines` | GET | Medicine catalog & price list |
| `/api/pharmacy/checkout` | POST | Process pharmacy order |
| `/api/diagnostics/tests` | GET | Diagnostic test catalog |
| `/api/diagnostics/book` | POST | Schedule diagnostic test |

---

*e-AROGYATA — Smart Hospital Platform | Built for SIH 2024*
