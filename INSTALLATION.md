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
3. **Inisialisasi Prisma**
   ```
   cd server
   npx prisma migrate
   npx prisma studio   # Menjalankan db
   cd ../              # Untuk kembali ke root direktori
   ```
4. **Jalankan server dan client secara bersamaan**
   ```
   npm run dev
   ```

### Perintah Lain

- **Install semua dependencies (opsional)**
  ```
  npm run all
  ```
- **Lakukan ini untuk inisialisasi untuk setup awal**
  ```
  npm i
  npm run postinstall
  npm run db
  npm run dev
  ```

---

## Dokumentasi

- [Dokumentasi API Server](/server/README.md)
- [README Client](/client/README.md)

---

## Cara Berkontribusi

- **Selalu buat branch baru untuk setiap pekerjaan. Jangan push langsung ke `main`, push ke `dev`.**
  ```
  git branch nama_branch
  git checkout nama_branch
  ```
- Setelah selesai, lakukan pull request ke branch `dev`.

---

## Catatan

- Semua endpoint yang membutuhkan autentikasi harus menyertakan header `Authorization`.
- Untuk transfer dan topup, lihat contoh request/response pada endpoint transaksi dan topup.
- Pagination didukung pada sebagian besar endpoint list melalui query parameter `page` dan `limit`.
- Untuk detail lebih lanjut, lihat [Postman Collection](./E-Wall.postman_collection.json)
