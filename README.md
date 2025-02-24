# Portfolio Frontend - README

## Introduction

Welcome to the **Portfolio Frontend** repository! 🎉 This is a ready-to-use frontend template for creating your personal portfolio. You can either use it as is or modify it to suit your needs. This frontend connects to a backend via REST APIs and utilizes data stored through an admin panel, helping you showcase your skills and unlock new opportunities.

🚀 **Live Demo**: [dhairyapatel.me](https://dhairyapatel.me/)

---

## 🌟 Quick Deployment

### **Setup Environment Variables**

To communicate with the backend, create a `.env` file and add the following environment variables:

```env
VITE_API_KEY=//your-api-key
VITE_EMAIL=//your-email
VITE_API_BASE_URL=https://dhairyapatel.me/api
VITE_PUBLIC_KEY=//your-public-key
```

🔑 **How to Generate API Key & Public Key?**

1. Login to the [Admin Panel](https://admin.dhairyapatel.me).
2. Generate your API key and public key from the homepage.

---

## 🔌 Useful Backend APIs

These APIs will help you fetch portfolio data and manage your projects.

### **Authentication**

To make any request, you need to first authenticate with the backend API. Before making the API call, encrypt your `VITE_API_KEY` using your public key. See an example in [`src/lib/encryption.ts`].

#### **Authenticate with API Key**

**Endpoint:**

```http
POST https://admin.dhairyapatel.me/api/users/auth/api-key
```

**Request Body:**

```json
{
  "encryptedKey": "your-encrypted-api-key",
  "email": "your-email@example.com"
}
```

**Response:**

```json
{
  "message": "Authentication successful",
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }
}
```

---

### **Fetch Portfolio Data**

This API returns all the data needed for your portfolio (similar to [dhairyapatel.me](https://dhairyapatel.me/)).

**Endpoint:**

```http
GET https://admin.dhairyapatel.me/api/portfolio/
```

**Headers:**

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

**Response:**

```json
{
  "name": "John Doe",
  "about": "Software Developer passionate about web technologies.",
  "status": "Open to work",
  "featuredProjects": [
    /* Projects List */
  ],
  "education": [
    /* Education Details */
  ],
  "experience": [
    /* Experience Details */
  ],
  "contact": { "location": "host_location" }
}
```

---

### **Fetch Projects**

Retrieve a list of all projects associated with the user.

**Endpoint:**

```http
GET https://admin.dhairyapatel.me/api/projects/
```

**Headers:**

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

**Response:**

```json
[
  {
    "_id": "project-id",
    "title": "Awesome Project",
    "description": "Project description here.",
    "programmingLanguages": ["JavaScript", "Python"],
    "githubRepo": "https://github.com/user/repo",
    "liveWebLink": "https://project-live-link.com",
    "projectType": ["Web Development", "Open Source"],
    "specialNote": "This project was featured at a major event.",
    "startDate": "2023-01-01",
    "endDate": "2023-06-01",
    "iconImage": "https://s3-url.com/icon.png",
    "s3Key": "s3-project-key",
    "currentlyWorking": false
  }
]
```

---

## 📬 Send a Message

You can allow visitors to send a message directly to you through your portfolio.

**Endpoint:**

```http
POST https://admin.dhairyapatel.me/api/contact/send
```

**Headers:**

```json
{
  "Authorization": "Bearer your-jwt-token"
}
```

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "message": "Hello, I love your portfolio!"
}
```

**Response:**

```json
{
  "message": "Your message has been sent successfully!"
}
```

---

## 💡 Contributing

1. Fork the repository.
2. Create a new branch (`feature-branch-name`).
3. Make your changes and commit (`git commit -m 'Add some feature'`).
4. Push to your branch (`git push origin feature-branch-name`).
5. Create a Pull Request!

---

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

Happy coding! 🚀
