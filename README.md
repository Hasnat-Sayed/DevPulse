# DevPulse API

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

🔗 **Live URL:** https://devplus-sand.vercel.app  
📁 **GitHub:** https://github.com/Hasnat-Sayed/DevPulse

---

## Features

- User registration and authentication with JWT
- Role-based access control (contributor / maintainer)
- Create, read, update, and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Reporter details attached to every issue response

---

## Tech Stack

| Technology | Usage |
|---|---|
| Node.js | LTS runtime |
| TypeScript | Strictly typed codebase |
| Express.js | Modular router architecture |
| PostgreSQL | Relational database via NeonDB |
| pg | Native PostgreSQL driver |
| bcrypt | Password hashing |
| jsonwebtoken | JWT authentication |

---

## Setup & Installation

1. **Clone the repository**
```bash
git clone https://github.com/Hasnat-Sayed/DevPulse.git
cd DevPulse
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a `.env` file** in the root directory
```env
PORT=3000
DATABASE_URL=your_neondb_connection_string
JWT_SECRET=your_secret_key
```

4. **Run in development**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
npm start
```

---

## Database Schema

### `users`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incrementing identifier |
| name | VARCHAR(255) | Full display name |
| email | VARCHAR(255) UNIQUE | Login email address |
| password | TEXT | Bcrypt hashed password |
| role | VARCHAR(20) | `contributor` or `maintainer`, defaults to `contributor` |
| created_at | TIMESTAMPTZ | Account creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

### `issues`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | Auto-incrementing identifier |
| title | VARCHAR(150) | Short descriptive headline |
| description | TEXT | Detailed explanation (min 20 chars) |
| type | VARCHAR(20) | `bug` or `feature_request` |
| status | VARCHAR(20) | `open`, `in_progress`, or `resolved`, defaults to `open` |
| reporter_id | INTEGER | References the user who submitted the issue |
| created_at | TIMESTAMPTZ | Issue creation timestamp |
| updated_at | TIMESTAMPTZ | Last update timestamp |

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |

### Issues

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues with optional filters |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Parameters for `GET /api/issues`

| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | none |
| `status` | `open`, `in_progress`, `resolved` | none |

### Authorization Header
```
Authorization: <JWT_TOKEN>
```

---

## Role-Based Access Control (RBAC)

| Action | Contributor | Maintainer |
|---|---|---|
| Register / Login | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| View single issue | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| Update own issue (status: open only) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Change issue status | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |

---

## Project Structure

```
src/
├── config/         # Environment variables
├── db/             # PostgreSQL pool and table initialization
├── middleware/     # Auth middleware, global error handler
├── modules/
│   ├── auth/       # Register & login (route, controller, service)
│   └── issues/     # CRUD issues (route, controller, service)
├── types/          # Express Request type extension
├── utils/          # sendResponse, validateFields
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```


---

> Built with 💻 by [Hasnat Bin Sayed](https://github.com/Hasnat-Sayed)  
> DevPulse — Keep your team's pulse on every bug and feature, always.