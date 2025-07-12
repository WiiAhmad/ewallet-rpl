# E-Wall API Documentation

This document provides details on the available API endpoints for the E-Wall wallet service, based on the provided Postman collection.

**Base URL**: `/api`

**Authentication**: Most endpoints require a JSON Web Token (JWT) to be passed in the `Authorization` header with the `Bearer` scheme.
```
Authorization: Bearer <your_access_token>
```

---

## 1. Authentication (`/auth`)

### **POST /auth/register**
Register a new user account.

**Request Body:**
```json
{
    "name": "Joko",
    "phone": "+6200333122",
    "email": "joko@example.com",
    "password": "testaccount123"
}
```

**Success Response (201):**
```json
{
    "message": "User registered successfully",
    "data": {
        "id": "clw...", // UUID
        "name": "Joko",
        "phone": "+6200333122",
        "email": "joko@example.com"
    }
}
```

---

### **POST /auth/login**
Login to receive access token.

**Request Body:**
```json
{
    "email": "joko@example.com",
    "password": "testaccount123"
}
```

**Success Response (200):**
```json
{
    "message": "Login successful",
    "data": {
        "id": "clw...",
        "name": "Joko",
        "email": "joko@example.com",
        "role": "User"
    },
    "tokens": "Bearer ey..."
}
```

---

### **POST /auth/logout**
Logout the user.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Success Response (204):**  
No content.

---

## 2. User (`/user`)

### **GET /user/me**
Get current user info.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Success Response (200):**
```json
{
    "message": "User Found successful",
    "data": {
        "id": "clw...",
        "name": "Joko",
        "phone": "+6200333122",
        "email": "joko@example.com",
        "address": "test"
    }
}
```

---

### **PUT /user/me**
Update user info.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Request Body:**
```json
{
    "name": "Joko",
    "phone": "+6200333122",
    "email": "joe@example.com"
}
```

---

## 3. Wallet (`/wallets`)

### **POST /wallets**
Create a new wallet.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Request Body:**
```json
{
    "name": "Second Wallet",
    "desc": "Lorem Ipsum Sit Dolor"
}
```

---

### **GET /wallets/me**
Get all wallets belonging to the authenticated user.

**Headers:**  
`Authorization: Bearer <your_access_token>`

---

### **PUT /wallets/:id**
Update wallet by ID.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Request Body:**
```json
{
    "name": "First Wallet",
    "desc": "Lorem Lorem Ipsum"
}
```

---

### **DELETE /wallets/:id**
Delete wallet by ID.

**Headers:**  
`Authorization: Bearer <your_access_token>`

---

### **GET /wallets/:number**
Get other user's wallet by wallet number.

**Headers:**  
`Authorization: Bearer <your_access_token>`

---

## 4. Transaction (`/transactions`)

### **POST /wallets/:walletNumber/topup**
Top up a wallet.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Request Body:**
```json
{
    "amount": 250000,
    "payment_method": "Bank Transfer",
    "reference_id": "BANK_TRF_12345XYZ"
}
```

---

### **POST /wallets/transfer**
Transfer between wallets.

**Headers:**  
`Authorization: Bearer <your_access_token>`

**Request Body:**
```json
{
    "fromWalletId": "W5HCCVHR",
    "toWalletNumber": "ILGVZCE4",
    "amount": 50000,
    "note": "Kas"
}
```

---

### **GET /transactions**
Get user transaction history.

**Headers:**  
`Authorization: Bearer <your_access_token>`

---

### **GET /topups**
Get user topup history.

**Headers:**  
`Authorization: Bearer <your_access_token>`

---

## 5. Admin & Owner Endpoints

### **GET /admin/topups**
Get all topup requests (Admin/Owner only).

**Headers:**  
`Authorization: Bearer <admin_access_token>`

---

### **GET /admin/transactions**
Get all transactions (Admin/Owner only).

**Headers:**  
`Authorization: Bearer <admin_access_token>`

---

### **GET /admin/users**
Get all user info (Admin/Owner only).

**Headers:**  
`Authorization: Bearer <admin_access_token>`

---

### **GET /admin/wallets**
Get all wallets (Admin/Owner only).

**Headers:**  
`Authorization: Bearer <admin_access_token>`

---

### **POST /topups/:topup_id/approve**
Approve or reject a topup (Admin/Owner only).

**Headers:**  
`Authorization: Bearer <admin_access_token>`

**Request Body (Approve):**
```json
{
    "status": "Approve",
    "admin_notes": "Verified payment receipt from user."
}
```

**Request Body (Reject):**
```json
{
    "status": "Rejected",
    "admin_notes": "Topup has rejected with wrong proof of transaction"
}
```

---

## Notes

- Semua endpoint yang membutuhkan autentikasi harus menyertakan header `Authorization`.
- Untuk transfer dan topup, lihat contoh request/response pada endpoint transaksi dan topup.
- Pagination didukung pada sebagian besar endpoint list melalui query parameter `page` dan `limit`.
- Untuk detail lebih lanjut, lihat [Postman Collection](./E-Wall.postman_collection.json)