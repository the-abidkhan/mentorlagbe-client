# MentorLagbe 🎓
### Connecting Students with the Right Tutors

MentorLagbe is a full-stack online tuition management platform designed to connect students with qualified tutors. Students can discover tuition opportunities and apply for suitable posts, while tutors can publish tuition requirements and manage applications. Administrators oversee users, tuition approvals, and platform transactions.

<p align="center">
  <a href="https://mentorlagbe-client-ebon.vercel.app/">
    <strong>🌐 Live Website</strong>
  </a>
  |
  <a href="https://github.com/the-abidkhan/mentorlagbe-client">
    <strong>💻 Client Repository</strong>
  </a>
  |
  <a href="https://github.com/the-abidkhan/mentorlagbe-server">
    <strong>⚙️ Server Repository</strong>
  </a>
</p>

---

## 🚀 Live Links

| Resource | URL |
|---|---|
| Live Website | https://mentorlagbe-client-ebon.vercel.app/ |
| Server API | https://mentorlagbe-server-theta.vercel.app |
| Client GitHub | https://github.com/the-abidkhan/mentorlagbe-client |
| Server GitHub | https://github.com/the-abidkhan/mentorlagbe-server |

**Project Status:** Deploying

---

## ✨ Key Features

### 🔐 Authentication & User Management
- Secure user registration and login.
- Email and password authentication.
- Google authentication.
- Three user roles: Student, Tutor, and Admin.
- Role-based dashboards and protected routes.
- User profile management.

### 👨‍🎓 Student Features
- Browse approved and active tuition posts.
- Search tuition by title and subject.
- Filter tuition by class level and learning mode.
- Apply for available tuition opportunities.
- View submitted applications.
- Cancel pending applications.
- Save and bookmark tuition posts.
- Upgrade to Student Pro membership.

### 👨‍🏫 Tutor Features
- Create new tuition posts.
- Edit and delete tuition posts.
- Activate or deactivate tuition posts.
- View and manage student applications.
- Access tutor dashboard and statistics.
- Upgrade to Tutor Pro membership.

### 🛡️ Admin Features
- View platform statistics and overview.
- Manage users and update user roles.
- Approve or reject tuition posts.
- Monitor platform transactions.

### 💳 Membership & Payment
- Stripe Checkout integration.
- Student Pro membership: $10.
- Tutor Pro membership: $15.
- Payment verification.
- Stripe webhook integration.
- Automatic Pro plan activation after successful payment processing.

### 📌 Additional Features
- Image upload using ImgBB.
- Responsive user interface.
- Loading states and error handling.
- Toast notifications.
- Demo tuition seed data.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB |
| Authentication | Better Auth, JWT |
| Payment Gateway | Stripe |
| Image Hosting | ImgBB |
| Deployment | Vercel |
| Version Control | Git, GitHub |

---

## 📂 Project Structure

MentorLagbe is maintained in two separate repositories.

### Client Structure

```text
mentorlagbe-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── ...
├── package.json
└── ...
```

### Server Structure

```text
mentorlagbe-server/
├── api/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── seed.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── vercel.json
```

---

## 🗄️ Database Collections

MentorLagbe uses four MongoDB collections.

| Collection | Description |
|---|---|
| `users` | User accounts, roles, profiles, and membership plans |
| `tuitions` | Tuition posts and approval information |
| `applications` | Student applications for tuition posts |
| `payments` | Payment and transaction records |

---

## 💎 Membership Plans

| Plan | Price | Benefits |
|---|---:|---|
| Student Free | Free | Up to 5 bookmarks |
| Student Pro | $10 | Unlimited bookmarks |
| Tutor Free | Free | Up to 2 tuition posts |
| Tutor Pro | $15 | Unlimited tuition posts |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB Atlas account
- Stripe account
- ImgBB API key

### 1. Clone the Client Repository

```bash
git clone https://github.com/the-abidkhan/mentorlagbe-client.git

cd mentorlagbe-client

npm install
```

Create a `.env.local` file in the client root directory.

```env
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

Run the client:

```bash
npm run dev
```

Client will run at:

```text
http://localhost:3000
```

### 2. Clone the Server Repository

Open another terminal:

```bash
git clone https://github.com/the-abidkhan/mentorlagbe-server.git

cd mentorlagbe-server

npm install
```

Create a `.env` file in the server root directory.

```env
PORT=5000
CLIENT_URL=http://localhost:3000

DB_NAME=mentorlagbe
MONGODB_URI=your_mongodb_connection_string

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Run the development server:

```bash
npm run dev
```

### 3. Build the Projects

Client:

```bash
npm run build
```

Server:

```bash
npm run build
```

### 4. Seed Demo Data

From the server directory:

```bash
npm run seed
```

---

## 🔗 API Overview

The backend provides RESTful API endpoints.

| Endpoint | Description |
|---|---|
| `/api/auth` | Authentication and user sessions |
| `/api/tuitions` | Tuition creation and management |
| `/api/applications` | Student application management |
| `/api/admin` | Administrative operations |
| `/api/payments` | Stripe payment operations |
| `/api/payments/webhook` | Stripe webhook events |

Protected API routes use authentication middleware and role-based authorization.

---

## ☁️ Deployment

Both frontend and backend are deployed separately using Vercel.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Vercel |
| Database | MongoDB Atlas |
| Payment | Stripe |

Environment variables must be configured in the respective Vercel project settings.

For Stripe integration, configure a webhook endpoint pointing to:

```text
https://your-server-domain/api/payments/webhook
```

Subscribe to the `checkout.session.completed` event.

---

## 🔒 Security

- Sensitive credentials are stored in environment variables.
- Environment files are excluded from version control.
- Protected endpoints require authentication.
- Role-based authorization restricts access to sensitive operations.
- Server-side validation is used for important operations.

**Never commit API keys, database credentials, or other secrets to GitHub.**

---

## 👨‍💻 Author

**Md Abid Khan**

Full-Stack Developer

- GitHub: https://github.com/the-abidkhan
- LinkedIn: https://www.linkedin.com/in/abidkhan-dev
- Email: theabidkhan.me@gmail.com

---

## 📄 License

This project was developed as an academic project.

---

<p align="center">
  **MentorLagbe — Connecting Students with the Right Tutors.**
</p>