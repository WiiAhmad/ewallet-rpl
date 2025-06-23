# Wallet Service API Documentation

This document provides details on the available API endpoints for the wallet service.

**Base URL**: `/api`

**Authentication**: Most endpoints require a JSON Web Token (JWT) to be passed in the `Authorization` header with the `Bearer` scheme.
`Authorization: Bearer <your_access_token>`

---

## 1. Authentication (`/auth`)
### **`POST /auth/register`**
Register a new user account.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name" : "user",
    "phone" : "+62",
    "email": "user@example.com",
    "password": "yourstrongpassword"
  }
- **Success Response (201)**:
```json
    {
    "message": "User registered successfully",
    "data": {
        "id": "clw...", // UUID
        "name" : "user",
        "phone" : "+62",
        "email": "user@example.com",
        }
    }
```
- **Failed Response**:
```json
    {
    "message": "Username must not blank, etc",
    }
```


### **`POST /auth/login`**
Log in to receive access
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "yourstrongpassword"
  }

- **Success Response (200)**:
```json
    {
    "message": "Login successful",
    "data": {
        "id": "clw...",
        "name" : "user",
        "email": "user@example.com",
    },
    "tokens": "ey...",
    }
```
- **Failed Response (400)**:
```json
    {
    "message": "Username must not blank, etc",
    }
```

### **`POST /auth/logout`**
Logout the user
- **Body**
```json
    {
        "token" : "ey...."
    }
```
- **Success Response (204)**:

## 2. Users (`/user`)
### **`GET /user/me`**
Check users
- **Access**: Private (User)
- **Body**
```json
    {
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
    "message": "User Found successful",
    "data": {
        "id": "clw...", // UUID
        "name" : "user",
        "phone" : "+62",
        "email": "user@example.com",
        "address" : "test",
        }
    }
```
- **Unauthorized Response (401)**:
```json
    {
    "message": "User Unauthorized, Please Login Again",
    }
```

### **`PUT /user/me`**
Update Users
- **Access**: Private (User)
- **Body**
```json
    {
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
    "message": "Update successful",
    "data": {
        "id": "clw...", // UUID
        "name" : "user",
        "phone" : "+62",
        "email": "user@example.com",
        "address" : "test",
        }
    }
```
- **Failed Response (400)**:
```json
    {
    "message": "field must not blank, etc",
    }
```
- **Unauthorized Response (401)**:
```json
    {
    "message": "User Unauthorized, Please Login Again",
    }
```

## 3. Wallets (`/wallets`)
### **`GET /wallets/me`**
Get all wallets belonging to the authenticated user.
- **Access**: Private (User)
- **Body**
```json
    {
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
        "data" : [
            {
            "id": "wallet 1...",
            "name": "My Primary Wallet",
            "number": "WLT-...",
            "balance": 100.50,
            "desc" : "smth",
            },
            {
            "id": "wallet 2...",
            "name": "My Second Wallet",
            "number": "WLT-...",
            "balance": 100.50,
            "desc" : "smth",
            },
        ]
    }
```
- **Unauthorized Response (401)**:
```json
    {
    "message": "User Unauthorized, Please Login Again",
    }
```

### **`POST /wallets`**
Create a new wallet for the authenticated user.
- **Access**: Private (User)
- **Body**
```json
    {
        "data" : {
            "name": "My Second Wallet",
            "desc" : "smth",
        },
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
        "message" : "Created wallet successfully",
        "data" : {
            "id": "New wallet...",
            "name": "My Second Wallet",
            "number": "WLT-...",
            "balance": 0,
            "desc" : "smth",
        }
    }
```
- **Failed Response (400)**:
```json
    {
        "message": "name must not blank, etc",
    }
```
- **Unauthorized Response (401)**:
```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
```

### **`PUT /wallets/:id`**
Update wallet
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Body**
```json
    {
        "data" : {
            "name": "My Second Wallet",
            "desc" : "smth",
        },
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
        "message" : "Update wallet successfully",
        "data" : {
            "name": "My Second Wallet",
            "desc" : "smth",
        }
    }
```
- **Failed Response (400)**:
```json
    {
    "message": "name must not blank, etc",
    }
```
- **Unauthorized Response (401)**:
```json
    {
    "message": "User Unauthorized, Please Login Again",
    }
```

### **`Delete /wallets/:id`**
Delete wallet
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Body**
```json
    {
        "token" : "ey...."
    }
```
- **Success Response (200)**:
```json
    {
        "message" : "Delete wallet successfully",
    }
```
- **Unauthorized Response (401)**:
```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
```
- **Failed Response (404)**:
```json
    {
        "message": "Wallet not found",
    }
```