# 🏕️ OutdoorOasis

A full-stack web application for outdoor enthusiasts to discover, review, and share campgrounds and adventure spots. Built with **Node.js**, **Express**, and **MongoDB**, this app features a dynamic frontend with **EJS** templates, secure user authentication with **Passport**, and interactive maps powered by **Maptiler**. Users can upload images via **Cloudinary**, and the app ensures security with **Helmet** and **express-mongo-sanitize**. 🌲

---

## 📑 Table of Contents

- ✨ Features
- 🛠️ Tech Stack
- ⚙️ Installation
- 📚 Usage
- 🗂️ Project Structure
- 📜 Scripts
- 🤝 Contributing
- 📄 License

---

## ✨ Features

- **Discover Campgrounds** 🗺️: Browse and search for outdoor locations.
- **User Reviews** ⭐: Add, edit, and delete reviews for campgrounds.
- **Image Uploads** 📸: Upload campground images with **Cloudinary**.
- **Interactive Maps** 🧭: Visualize locations using **Maptiler**.
- **Secure Authentication** 🔒: User login and registration with **Passport**.
- **Responsive Design** 📱💻: Built with **EJS** and **Bootstrap** (optional) for a seamless experience.
- **Data Security** 🛡️: Protected with **Helmet**, **express-mongo-sanitize**, and **sanitize-html**.
- **Form Validation** ✅: Robust validation with **Joi**.

---

## 🛠️ Tech Stack

### 🌐 Frontend

- **EJS** 📄: For server-side rendered templates.
- **EJS-Mate** 🧩: For reusable EJS layouts.
- **Bootstrap** (optional) 🎨: For responsive styling (if included in views).

### ⚙️ Backend

- **Node.js & Express** 🖥️: For a robust server-side application.
- **MongoDB & Mongoose** 🗄️: For data storage and management.
- **Passport & passport-local** 🔑: For user authentication.
- **Cloudinary & Multer** 📸: For image uploads and storage.
- **Maptiler** 🗺️: For interactive maps.
- **Joi** ✅: For form and data validation.
- **Helmet** 🛡️: For HTTP security headers.
- **express-mongo-sanitize** 🔒: For preventing MongoDB injection attacks.
- **sanitize-html** 🧼: For sanitizing user input.
- **express-session & connect-mongo** 🔗: For session management.
- **connect-flash** 💬: For flash messages.

### 🧰 Dev Tools

- **dotenv** 🌍: For environment variable management.
- **method-override** 🔄: For supporting PUT and DELETE requests in forms.

---

## ⚙️ Installation

### 📋 Prerequisites

- **Node.js** (v16 or higher) 🟢
- **MongoDB** (local or MongoDB Atlas) 🗄️
- **npm** (included with Node.js) 📦
- **Cloudinary Account** (for image uploads) 📸
- **Maptiler API Key** (for maps) 🗺️

### 🛠️ Steps

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/outdooroasis.git
   cd outdooroasis
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory:

   ```
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   MAPTILER_API_KEY=your_maptiler_api_key
   PORT=3000
   ```

4. **Start the application** 🚀:

   ```bash
   node index.js
   ```

   The app will be available at `http://localhost:3000` 🌐.

---

## 📚 Usage

- Open `http://localhost:3000` in your browser 🌐.
- **Register or log in** to access full features 🔐.
- Browse **campgrounds** or search for specific locations 🗺️.
- Add a **new campground** with details and images 📸.
- Leave **reviews** and rate your experiences ⭐.
- Explore locations on an **interactive map** powered by **Maptiler** 🧭.

---

## 🗂️ Project Structure

```
outdooroasis/
├── models/ 🗄️
│   ├── campground.js
│   ├── review.js
│   └── user.js
├── routes/ 🛤️
│   ├── campgrounds.js
│   ├── reviews.js
│   └── users.js
├── views/ 📄
│   ├── layouts/ 🧩
│   ├── campgrounds/ 🏕️
│   ├── users/ 👤
│   └── error.ejs 🚫
├── public/ 📂
│   ├── stylesheets/ 🎨
│   └── scripts/ 📜
├── middleware/ 🔒
├── utils/ 🛠️
├── .env 🔧
├── index.js 🚀
└── package.json 📦
```

---

## 📜 Scripts

- `npm start` 🚀: Run the application with `node index.js`.
- `npm test` 🧪: Placeholder for tests (not implemented).

---

## 🤝 Contributing

We welcome contributions! 🎉 To get started:

1. Fork the repository 🍴.
2. Create a new branch (`git checkout -b feature/your-feature`) 🌿.
3. Make your changes and commit (`git commit -m "Add your feature"`) ✍️.
4. Push to the branch (`git push origin feature/your-feature`) 🚀.
5. Open a Pull Request 📬.

Please ensure your code is secure and follows the project’s conventions. ✅

---

## 📄 License

This project is licensed under the **ISC License**. See the `package.json` for details. 📜

---

**Happy adventuring!** 🏕️🌲✨
