# E-Wall

## Deskripsi Proyek

E-Wall adalah aplikasi dompet digital yang memungkinkan pengguna untuk membuat beberapa kantong (wallet), melakukan top up, transfer antar wallet, serta mengelola riwayat transaksi dan top up. Proyek ini terdiri dari   frontend (React) dan backend (Node.js/Express/Prisma).

---

## Cara Menjalankan Project
- Lihat [README Project](/INSTALLATION.md)

---

## Dokumentasi & API

- [README Client](/client/README.md)
- [Dokumentasi API Server](/server/README.md)
- [Postman Collection](./E-Wall.postman_collection.json)

---

## Fitur Utama

- **Autentikasi JWT** (dengan dukungan cookie untuk login otomatis di browser/Postman)
- **Manajemen User** (register, login, update profil)
- **Manajemen Wallet** (buat, edit, hapus, lihat detail, multi-wallet per user)
- **Top Up** (permintaan top up, approval admin/owner, riwayat top up)
- **Transfer Antar Wallet** (dalam satu user atau antar user)
- **Riwayat Transaksi & Top Up** (filter, pagination)
- **Role-based Access Control** (User, Admin, Owner)
- **Halaman Admin/Owner** (lihat semua user, wallet, transaksi, top up, approval)
- **Notifikasi status transaksi/top up**
- **Frontend modern dengan React + TailwindCSS**

---

## Catatan

- Semua endpoint yang membutuhkan autentikasi harus menyertakan header `Authorization`.
- Backend juga menggunakan cookies untuk menyimpan JWT secara otomatis setelah login, sehingga dapat mengakses endpoint yang membutuhkan autentikasi tanpa perlu mengirim header Authorization secara manual jika menggunakan browser atau Postman dengan cookie support.
- Untuk transfer dan topup, lihat contoh request/response pada endpoint transaksi dan topup.
- Pagination didukung pada sebagian besar endpoint list melalui query parameter `page` dan `limit`.
- Untuk detail lebih lanjut, lihat [Postman Collection](./E-Wall.postman_collection.json).

---

## Tim Pengembang

|         Nama        | Path |    NIP    |
|---------------------|------|-----------|
| Lorem Ipsum Doloros |  FE  | 14522669  |
| Doloros Ipsum Lorem |  FE  | 14522669  |
| Ipsum Ipsum Doloros |  BE  | 14522669  |
| Lorem Lorem Doloros |  BE  | 14522669  |

---

2025 E-Wall. Dibuat untuk proyek akhir Matakuliah RPL.