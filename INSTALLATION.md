# E-Wall

## Cara Menjalankan Project

1. **Masuk ke folder project**
   ```
   cd ewallet-rpl
   ```
2. **Install semua dependencies**
   ```
   npm install
   ```

3. **Jalankan server dan client secara bersamaan**
   ```
   npm run dev
   ```

### Perintah Lain

- **Melihat isi database Sqlite (opsional)**
  ```
   npm run db
  ```

---

## Dokumentasi

- [Dokumentasi API Server](/server/README.md)
- [README Client](/client/README.md)

---

## Cara Berkontribusi

- **Selalu buat branch baru untuk setiap pekerjaan. Jangan push langsung ke `main`.**
  ```
  git branch nama_branch
  git checkout nama_branch
  ```

---

## Catatan

- Semua endpoint yang membutuhkan autentikasi harus menyertakan header `Authorization`.
- Untuk transfer dan topup, lihat contoh request/response pada endpoint transaksi dan topup.
- Pagination didukung pada sebagian besar endpoint list melalui query parameter `page` dan `limit`.
- Untuk detail lebih lanjut, lihat [Postman Collection](./E-Wall.postman_collection.json)
