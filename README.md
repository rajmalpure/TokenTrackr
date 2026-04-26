# TokenTrackr — Token-Based Attendance Incentive System

A full-stack web application that rewards student attendance with tokens redeemable for academic perks. Built with Node.js + Express + PostgreSQL on the backend and React + Vite + Tailwind CSS on the frontend, fully containerized with Docker and deployable to Kubernetes.

---

## Architecture Overview

| Service | Technology | Port |
|---|---|---|
| **Backend API** | Node.js + Express + PostgreSQL | 3000 |
| **Frontend** | React 18 + Vite + Tailwind CSS | 80 (nginx) |
| **Database** | PostgreSQL 15 | 5432 |

**Key flows:**
- Students attend class → Admin marks attendance via Admin Panel
- Each mark awards 10 tokens to the student's wallet
- Students redeem tokens for rewards: Certificate, Priority Seating, or Exam Fee Waiver

---

## Local Development Setup

### Prerequisites
- Node.js 18+, npm
- PostgreSQL 15+ running locally (or Docker)

### 1. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE attendance_db;"
psql -U postgres -d attendance_db -f backend/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
# Edit .env if needed (DB credentials, JWT_SECRET, PORT)
npm start
# Server running at http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## Docker Compose (Recommended)

Run the entire stack with a single command:

```bash
# From the project root (token-attendance/)
docker-compose up --build
```

- Frontend: http://localhost
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

> The schema is automatically applied on first run via `docker-entrypoint-initdb.d`.

To stop:

```bash
docker-compose down
# To also remove the database volume:
docker-compose down -v
```

---

## Kubernetes Setup

### Prerequisites
- A running Kubernetes cluster (e.g., minikube, EKS, GKE)
- `kubectl` configured with cluster access
- Images pushed to Docker Hub (replace `YOURDOCKERHUBUSERNAME` in deployment YAMLs)

### Apply manifests in order:

```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-pvc.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### Verify deployments:

```bash
kubectl get pods
kubectl get services
kubectl get ingress
```

> **Note:** Apply the DB schema manually after first postgres pod startup:
> ```bash
> kubectl exec -it <postgres-pod-name> -- psql -U postgres -d attendance_db -f /schema.sql
> ```
> Or use a Kubernetes Job/InitContainer to auto-apply the schema.

---

## API Endpoints

| Method | Path | Auth Required | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ | Register a new user (name, email, password, role) |
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `POST` | `/api/attendance/mark` | ✅ Admin | Mark attendance for a student by user_id + date |
| `GET` | `/api/attendance/:userId` | ✅ | Get all attendance records and count for a user |
| `GET` | `/api/tokens/balance` | ✅ | Get token wallet balance for logged-in user |
| `POST` | `/api/tokens/redeem` | ✅ | Redeem tokens for a reward |
| `GET` | `/api/tokens/history` | ✅ | Get redemption history for logged-in user |
| `GET` | `/health` | ❌ | Health check — returns `{"status":"ok"}` |

**Auth header format:** `Authorization: Bearer <jwt_token>`

---

## CI/CD Pipeline

**Trigger:** Push to the `main` branch.

**GitHub Secrets Required:**
| Secret | Description |
|---|---|
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password or access token |
| `KUBECONFIG` | Base64-encoded kubeconfig file for cluster access |

**Pipeline Steps:**
1. **Checkout** — Clone the repository
2. **Docker Login** — Authenticate with Docker Hub
3. **Build & Push Backend** — Build `./backend` and push image tagged `:latest` and `:<git-sha>`
4. **Build & Push Frontend** — Build `./frontend` and push image tagged `:latest` and `:<git-sha>`
5. **Setup kubectl** — Install latest kubectl
6. **Apply K8s Manifests** — Apply all files in `k8s/` in dependency order
7. **Update Images** — Point deployments to the new `:<git-sha>` image
8. **Rollout Restart** — Force rolling update for both backend and frontend
9. **Wait for Rollout** — Block until rollouts complete (120s timeout)

---

## Project Structure

```
token-attendance/
├── backend/
│   ├── src/
│   │   ├── config/db.js          # PostgreSQL pool
│   │   ├── middleware/auth.js    # JWT verification middleware
│   │   ├── routes/               # Route definitions
│   │   ├── controllers/          # Business logic
│   │   └── app.js               # Express app + server
│   ├── schema.sql                # Database schema
│   ├── .env                      # Environment variables
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/axios.js          # Axios instance + interceptors
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/                # Login, Register, Dashboard, AdminPanel, TokenWallet
│   │   ├── components/Navbar.jsx
│   │   └── App.jsx              # Router + protected routes
│   ├── nginx.conf
│   ├── .env
│   ├── package.json
│   └── Dockerfile (multi-stage)
├── k8s/                          # Kubernetes manifests
├── .github/workflows/deploy.yml  # CI/CD pipeline
├── docker-compose.yml
└── README.md
```
