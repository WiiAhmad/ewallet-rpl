# Ewallet API Endpoints

## Authentication

### Register User
- **POST** `/register`
- **Body:**
  ```json
  {
    "username": "your_username",
    "password": "your_password",
    "email": "your_email@example.com"
  }
  ```
- **Response:**  
  `201 Created` with user info

---

### Login
- **POST** `/login`
- **Body:**
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response:**  
  `200 OK` with JWT token and user info

---

## User

### Get User by UID (Protected)
- **GET** `/user/:uid`
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:**  
  `200 OK` with user info

---

### Delete User by UID (Protected)
- **DELETE** `/user/:uid`
- **Headers:**
  ```
  Authorization: Bearer <JWT_TOKEN>
  ```
- **Response:**  
  `200 OK` on success

---

## Health Check

### Database Connection Check
- **GET** `/db-check`
- **Response:**  
  `{ "connected": true }` if DB is connected

---

## Notes
- All protected endpoints require a valid JWT in the `Authorization` header.
- JWT is obtained from the `/login` endpoint.