# 📝 SmartNotes

![SmartNotes Banner](./screenshots/banner.png) <!-- 📸 SCREENSHOT 1: Add a wide, high-quality screenshot of the dashboard with some notes in both Light and Dark mode side-by-side here, and save it as "banner.png" in a "screenshots" folder. -->

**SmartNotes** is a modern, responsive, and secure full-stack MERN application designed to help you organize your ideas, tasks, and daily thoughts efficiently.

## ✨ Features

- **🔐 Secure Authentication:** User Registration, Login, and Password Management with JWT and bcrypt.
- **📝 Full CRUD for Notes:** Create, Read, Update, and Delete your personal notes.
- **📌 Pin Important Notes:** Keep your most critical notes at the very top of your dashboard.
- **🔍 Search & Filter:** Quickly find what you need by searching titles/descriptions or filtering by category (Study, Work, Personal, Ideas).
- **🗂️ Dynamic Sorting:** Sort your notes by Newest, Oldest, or Alphabetically (A-Z, Z-A).
- **📊 Dashboard Stats:** Get a quick overview of your total notes and categorized counts.
- **🌗 Dark Mode:** Easy on the eyes with a beautiful glassmorphic dark mode toggle.
- **📱 Fully Responsive:** Works seamlessly on desktops, tablets, and mobile devices.

---

## 📸 Screenshots

> **💡 Note to Developer:** Create a folder named `screenshots` at the root of your project and place the following images inside it to make your README look professional!

### 1. Authentication (Login/Signup)
![Login Page](./screenshots/login.png) <!-- 📸 SCREENSHOT 2: Take a screenshot of the beautiful glassmorphism Login page and save it as "login.png" -->

### 2. Dashboard
![Dashboard](./screenshots/dashboard.png) <!-- 📸 SCREENSHOT 3: Take a screenshot of the main dashboard populated with notes and save it as "dashboard.png" -->

### 3. Add / Edit Note
![Edit Note](./screenshots/edit-note.png) <!-- 📸 SCREENSHOT 4: Take a screenshot of the "Add New Note" or "Edit Note" form section and save it as "edit-note.png" -->

### 4. User Profile
![Profile Page](./screenshots/profile.png) <!-- 📸 SCREENSHOT 5: Take a screenshot of the User Profile and Change Password page and save it as "profile.png" -->

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router DOM
- Axios (with centralized interceptors)
- Vanilla CSS (Glassmorphism & Responsive Design)

**Backend:**
- Node.js & Express.js
- MongoDB Atlas & Mongoose
- JSON Web Tokens (JWT) for Authentication
- bcryptjs for password hashing

---

## 🚀 Running the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/Kaustav1409/SmartNotes.git
cd SmartNotes
```

### 2. Setup the Backend
Open a terminal and navigate to the backend folder:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
npm start
```
*The server should now be running on `http://localhost:5000`.*

### 3. Setup the Frontend
Open a **new** terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*The application should now be running on `http://localhost:5174` (or similar port).*

---

## 🌍 Deployment

### Deploying the Backend (Render)
1. Push your code to GitHub.
2. Go to [Render](https://render.com) and create a new **Web Service**.
3. Connect your repository and set the **Root Directory** to `backend`.
4. Set Build Command to `npm install` and Start Command to `node server.js`.
5. Add your `.env` variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).
6. Deploy and copy your production URL.

### Deploying the Frontend (Vercel)
1. Go to [Vercel](https://vercel.com) and import your repository.
2. Set the **Framework Preset** to `Vite`.
3. Set the **Root Directory** to `frontend`.
4. In **Environment Variables**, add `VITE_API_URL` and set its value to your Render backend URL (e.g., `https://smartnotes-backend-xxxx.onrender.com`).
5. Click **Deploy**.

---

## 👤 Author
**Kaustav Ghosh**
- GitHub: [@Kaustav1409](https://github.com/Kaustav1409)
