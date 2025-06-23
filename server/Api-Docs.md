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
    ```
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
    ```

- **Success Response (200)**:
    ```json
    {
        "message": "Login successful",
        "data": {
            "id": "clw...", // UUID
            "name" : "user",
            "email": "user@example.com",
        },
        "tokens": "Bearer ey...",
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

- **Headers** : *`Authorization: Bearer <your_access_token>`*

- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```

- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```

- **Success Response (204)**: No content

## 2. Users (`/user`)
### **`GET /user/me`**
Check users
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```

### **`PUT /user/me`**
Update Users
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```

## 3. Wallets (`/wallets`)
### **`GET /wallets/me`**
Get all wallets belonging to the authenticated user.
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

- **Success Response (200)**:
    ```json
    {
        "data" : [
            {
            "id": "clw...", // UUID
            "name": "My Primary Wallet",
            "number": "WLT-...",
            "balance": 100.50,
            "desc" : "smth",
            },
            {
            "id": "clw...", // UUID
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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```
- **Failed Response (404)**:
    ```json
    {
        "message": "Wallet not found",
    }
    ```

### **`GET /wallets/:id`**
Get wallets belong to the user (this use before transcation for checking wallet another users).
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

- **Success Response (200)**:
    ```json
    {
        "id": "clw...", // UUID
        "name": "Recipient's Wallet Name",
        "number": "WLT-...",
        "user": {
            "name" : "name user",
            "email": "recipient@example.com"
        }
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```
- **Failed Response (404)**:
    ```json
    {
        "message": "Wallet not found",
    }
    ```

### **`POST /wallets`**
Create a new wallet for the authenticated user.
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

- **Body**
    ```json
    {
        "data" : {
            "name": "My Second Wallet",
            "desc" : "smth",
        }
    }
    ```
- **Success Response (200)**:
    ```json
    {
        "message" : "Created wallet successfully",
        "data" : {
            "id": "clw...", // UUID
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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```

### **`PUT /wallets/:id`**
Update wallet
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

- **Body**
    ```json
    {
        "data" : {
            "name": "My Second Wallet",
            "desc" : "smth",
        }
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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```
- **Failed Response (404)**:
    ```json
    {
        "message": "Wallet not found",
    }
    ```

### **`Delete /wallets/:id`**
Delete wallet
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*

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
- **Invalid Response (403)**:
    ```json
    {
        "message": "Invalid User",
    }
    ```
- **Failed Response (404)**:
    ```json
    {
        "message": "Wallet not found",
    }
    ```

## 4. Transfer (`/wallets/transfer`)
### **`POST  /wallets/transfer`**
-   **Headers:** `Authorization: Bearer <userAccessToken>`
-   **Request Body:**
    ```json
    {
        "fromWalletId": "WLT-...",
        "toWalletNumber": "WLT-...",
        "amount": 50,
        "note" : "test"
    }
    ```
- **Success Response (200)**:
    ```json
    {
      "message": "Transfer successful",
      "data": {
        "updatedFromWallet": { "... "},
        "updatedToWallet": { "..." }
      }
    }
    ```
-   **Error Response (400):**
    ```json
    {
        "message": "Insufficient funds."
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```