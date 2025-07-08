# Wallet Service API Documentation

This document provides details on the available API endpoints for the wallet service.

**Base URL**: `/api`

**Authentication**: Most endpoints require a JSON Web Token (JWT) to be passed in the `Authorization` header with the `Bearer` scheme.
`Authorization: Bearer <your_access_token>`

**Payload for JWT**: 
```json
{
  "sub": "clw...",  // Subject: ID unik pengguna
  "name": "user",      // Nama pengguna
  "email": "user@example.com", // Email pengguna
  "role": "User",      // Peran pengguna (misalnya, 'User' atau 'Admin')
  "iat": 1750824322,   // Issued At: Waktu token dibuat (timestamp)
  "exp": 1750827922    // Expiration Time: Waktu token kedaluwarsa (timestamp)
}
```
**Headers for auth**: 
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR"
}
```

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
- **Failed Response (400)**:

    Email already in use

    Password must be at least 8 characters long

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
            "role": "User"
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
-   **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*
-   **Request Body:**
    ```json
    {
        "fromWalletId": "WLT-...",
        "toWalletNumber": "WLT-...",
        "amount": 50000,
        "note" : "test"
    }
    ```
- **Success Response (200)**:
    ```json
    {
        "message": "Transfer successful",
        "data": {
            "transaction_id": "txn_pqr456",
            "from_wallet": { 
                "number": "WLT-...",
                "new_balance": 450000
            },
            "to_wallet": { 
                "number": "WLT-...",
                "owner_name": "Recipient Name"
            },
            "timestamp": "2025-06-24T19:00:00Z"
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

## 5. Topup (`/wallets/:id/topup`)
### **`POST  /wallets/:id/topup`**
- **URL Params**: id=[number wallet]
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*
-   **Request Body:**
    ```json
    {
        "amount": 250000,
        "payment_method": "Bank Transfer",
        "reference_id": "BANK_TRF_12345XYZ"
    }
    ```
- **Success Response (202)**:
    ```json
    {
        "message": "Top-up request received and is pending approval.",
            "data": {
                "topup_id": "topup_abc123",
                "wallet_id": "WLT-...",
                "amount": 250000,
                "status": "pending",
                "requested_at": "2025-06-24T18:45:00Z"
            }
    }
    ```
- **Error Response (400)**:
    ```json
    {
        "message": "Invalid input provided.",
        "errors": {
            "amount": "Amount must be greater than 10000"
        }
    }
    ```
- **Error Response (404)**:
    ```json
    {
        "message": "Wallet with the specified ID not found."
    }
    ```

## 6. Transaction History (`/transactions`)

### **`GET  /transactions`**
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*
- **Query Param (Optional)** :
    - wallet_id=[wallet number]: Filter transactions by wallet number.
    - category=[Debit|Credit]: Filter by transaction type.
    - page=[page number]: Pagination page.
    - limit=[items per page]: Pagination limit.

- **Success Response (200)**:
    ```json
    {
        "message": "Transactions retrieved successfully",
        "data": [
            {
                "id": "txn_123",
                "type": "Debit",
                "amount": 50000,
                "description": "Transfer to WLT-12345678",
                "status": "Completed",
                "created_at": "2025-06-24T19:00:00Z",
            },
            {
                "id": "txn_124",
                "type": "Credit",
                "amount": 250000,
                "description": "Top-up from Bank Transfer",
                "status": "Completed",
                "created_at": "2025-06-24T18:50:00Z",
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 48,
            "items_per_page": 10
        }
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again"
    }
    ```

---

## 7. All Transactions (`/admin/transactions`)

### **`GET  /admin/transactions`**
- **Access**: Private (Admin/Owner)
- **Headers** : *`Authorization: Bearer <admin_access_token>`*
- **Query Param (Optional)** :
    - page=[page number]: Pagination page.
    - limit=[items per page]: Pagination limit.

- **Success Response (200)**:
    ```json
    {
        "message": "All transactions",
        "data": [
            {
                "id": "txn_123",
                "user": {
                    "uid": 1,
                    "name": "Alice",
                    "email": "alice@example.com"
                },
                "wallet": {
                    "wallet_id": 2,
                    "name": "Main Wallet",
                    "number": "WLT-87654321"
                },
                "type": "Debit",
                "amount": 50000,
                "description": "Transfer to WLT-12345678",
                "status": "Completed",
                "created_at": "2025-06-24T19:00:00Z",
                "from_wallet": "WLT-87654321",
                "to_wallet": "WLT-12345678"
            }
            // ... more transactions
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 48,
            "items_per_page": 10
        }
    }
    ```
- **Unauthorized/Forbidden Response (401/403)**:
    ```json
    {
        "message": "Access Denied"
    }
    ```

---

**Notes:**
- For transfer transactions, `from_wallet` and `to_wallet` will be filled based on the transaction description and wallet number.
- For non-transfer transactions (like top-up), these fields will be `null`.
- The `type` field will be `"Debit"` or `"Credit"` as per your transaction type.

### **`GET  /topups`**
- **Access**: Private (Admin Role Required)
- **Headers** : *`Authorization: Bearer <admin_access_token>`*
- **Query Param (Opsional)** :
    - status=[pending|completed|rejected]: Filter berdasarkan status top-up.

    - page=[nomor halaman]: Paginasi halaman.

    - limit=[jumlah per halaman]: Paginasi batas data per halaman.
- **Success Response (200)**:
    ```json
    {
        "message": "All top-up requests retrieved successfully",
        "data": [
            {
                "topup_id": "topup_abc123",
                "wallet_id": "WLT-111",
                "user": {
                    "id": "user_id_1",
                    "name": "User A",
                    "email": "usera@example.com"
                },
                "amount": 250000,
                "status": "pending",
                "requested_at": "2025-06-24T18:45:00Z"
            },
            {
                "topup_id": "topup_def456",
                "wallet_id": "WLT-222",
                "user": {
                    "id": "user_id_2",
                    "name": "User B",
                    "email": "userb@example.com"
                },
                "amount": 500000,
                "status": "completed",
                "requested_at": "2025-06-23T10:20:00Z",
                "approved_by": "admin_user_id_xyz",
                "approved_at": "2025-06-23T10:25:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 15,
            "total_items": 145,
            "items_per_page": 10
        }
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```
- **Error Response (403)**:
    ```json
    {
        "message": "Access denied. Admin role required."
    }
    ```
- **Error Response (404)**:
    ```json
        {
            "message": "No one has topup"
        }
    ```

### **`POST  /topups/:topup_id/approve`**
- **URL Params**: id=[number topup_id]
- **Access**: Private (Admin Role Required)
- **Headers** : *`Authorization: Bearer <admin_access_token>`*
-   **Request Body:**
    ```json
    {
        "admin_notes": "Verified payment receipt from user."
    }
    ```
- **Success Response (200)**:
    ```json
    {
        "message": "Top-up approved successfully. Wallet balance has been updated.",
        "data": {
            "topup_id": "topup_abc123",
            "wallet_id": "WLT-...",
            "amount": 250000,
            "status": "completed",
            "approved_by": "admin_user_id_xyz",
            "approved_at": "2025-06-24T18:50:00Z",
            "updated_wallet_balance": 1250000.50
        }
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```
- **Error Response (403)**:
    ```json
    {
        "message": "Access denied. Admin role required."
    }
    ```
- **Error Response (404)**:
    ```json
        {
            "message": "topup_id with the specified ID not found."
        }
    ```
- **Error Response (422)**:
    ```json
        {
            "message": "This top-up request cannot be processed.",
            "details": "The request has already been completed or rejected."
        }
    ```

## 6. Transaction History (`/transactions`)
### **`GET  /transactions`**
- **Access**: Private (User)
- **Headers** : *`Authorization: Bearer <your_access_token>`*
- **Query Param (Opsional)** :
    - wallet_id=[nomor wallet]: Filter transaksi berdasarkan nomor dompet.

    - category=[x|x]: Filter berdasarkan jenis transaksi.

    - page=[nomor halaman]: Paginasi halaman.

    - limit=[jumlah per halaman]: Paginasi batas data per halaman.

- **Success Response (200)**:
    ```json
    {
        "message": "Transactions retrieved successfully",
        "data": [
            {
                "id": "txn_pqr456",
                "type": "debit",
                "amount": 50000,
                "description": "Transfer to WLT-... (Pembayaran tagihan)",
                "status": "completed",
                "created_at": "2025-06-24T19:00:00Z"
            },
            {
                "id": "txn_def789",
                "type": "credit",
                "amount": 250000,
                "description": "Top-up from Bank Transfer",
                "status": "completed",
                "created_at": "2025-06-24T18:50:00Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_items": 48,
            "items_per_page": 10
        }
    }
    ```
- **Unauthorized Response (401)**:
    ```json
    {
        "message": "User Unauthorized, Please Login Again",
    }
    ```