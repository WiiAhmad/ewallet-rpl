# E-Wallet Frontend (e-wal)

Ini adalah repositori untuk frontend aplikasi E-Wallet (e-wal), sebuah proyek yang dibangun untuk tugas kuliah. Aplikasi ini dikembangkan menggunakan ReactJS (Vite) dan terhubung dengan backend berbasis Express.js dan Prisma untuk menyediakan platform e-wallet yang fungsional.

## Fitur

Aplikasi ini mendukung tiga peran pengguna yang berbeda dengan fungsionalitas masing-masing:

### 1. User

- **Autentikasi**: Pengguna dapat mendaftar dan masuk ke akun mereka dengan aman.
- **Manajemen Kantong (Wallet)**:
  - Membuat kantong baru untuk berbagai keperluan (misal: tabungan, pendidikan).
  - Melihat daftar semua kantong beserta total saldo gabungan.
  - Melihat detail setiap kantong, termasuk deskripsi dan saldo.
  - Mengedit nama dan deskripsi kantong.
  - Menghapus kantong (selain kantong utama yang dibuat otomatis).
- **Transaksi**:
  - **Top Up**: Mengajukan permintaan top up saldo dengan menyertakan ID bukti transfer, yang kemudian akan diverifikasi dan disetujui oleh Admin.
  - **Kirim Uang**: Mentransfer dana dengan aman ke nomor wallet pengguna lain.
  - **Pindah Uang**: Memindahkan dana antar kantong milik sendiri dengan mudah.
- **Riwayat**: Melihat riwayat semua transaksi dengan opsi filter berdasarkan kategori (pemasukan/pengeluaran) dan rentang tanggal.

### 2. Admin

- **Dasbor**: Mengakses dasbor khusus untuk mengelola aktivitas sistem.
- **Manajemen Top Up**: Memvalidasi dan menyetujui atau menolak permintaan top up dari pengguna.
- **Monitoring**: Melihat daftar semua pengguna, transaksi, dan wallet yang ada di dalam sistem.

### 3. Owner

- Memiliki semua hak akses yang dimiliki oleh Admin.
- (Direncanakan) Mengakses dasbor analitik untuk memantau metrik penting seperti pertumbuhan pengguna dan volume transaksi.

---

## Catatan & Rencana Pengembangan

Berikut adalah daftar fitur dan perbaikan yang perlu diimplementasikan agar aplikasi sesuai dengan desain UI/UX dan ekspektasi fungsional.

### Untuk Admin & Owner

- **Desain Dasbor Umum**:
  - Implementasikan desain dasbor yang lebih lengkap dengan _sidebar_ navigasi yang responsif.
- **Fitur Admin**:
  - **Riwayat Semua Transaksi**: Halaman untuk melihat seluruh transaksi yang terjadi di platform.
  - **Manajemen Pengguna**: Halaman untuk melihat daftar semua pengguna yang terdaftar.
  - **Persetujuan Top Up**: Halaman khusus untuk memvalidasi permintaan top up (saat ini sudah ada, perlu diintegrasikan ke dasbor baru).
- **Fitur Khusus Owner**:
  - **Dasbor Statistik**: Menambahkan komponen statistik (grafik, angka kunci) sebagai pembeda dari dasbor Admin.
  - **Manajemen Admin (Nice to have)**:
    - Fitur untuk menghapus akun Admin.
    - Fitur untuk mengubah peran `User` menjadi `Admin`.

### Untuk User

- **Desain & UI/UX**:
  - **Navbar Login/Register**: Menambahkan navbar di halaman login dan register (prioritas rendah).
  - **Navbar Pengguna**:
    - Membuat navbar sepenuhnya responsif.
    - Menambahkan menu _dropdown_ pada nama pengguna yang berisi tautan ke **Profil** dan tombol **Logout**.
    - Memberi indikator aktif (misal: `font-bold` atau garis bawah) pada item navigasi sesuai dengan halaman yang sedang dibuka.
  - **Hero Section (Total Uang)**: Sesuaikan desain tombol "Top Up", "Kirim", dan "Pindah" agar identik dengan desain UI/UX.
- **Fungsionalitas & Halaman**:
  - **Daftar Kantong**: Tampilkan **nomor wallet** di setiap kartu kantong. Pertimbangkan untuk menambahkan paginasi jika daftar kantong sangat banyak (nice to have).
  - **Halaman Detail Kantong**: Tambahkan tombol "Kembali" atau "Batal" yang mengarahkan pengguna kembali ke halaman utama.

---

## Tampilan Aplikasi

Berikut adalah beberapa contoh tampilan dari aplikasi:

|                                  Halaman Login                                  |                              Halaman Utama (Home)                               |
| :-----------------------------------------------------------------------------: | :-----------------------------------------------------------------------------: |
| ![Halaman Login](https://placehold.co/600x400/FFFFFF/000000?text=Halaman+Login) | ![Halaman Utama](https://placehold.co/600x400/FFFFFF/000000?text=Halaman+Utama) |

|                                  Detail Kantong                                   |                                Kirim Uang                                 |
| :-------------------------------------------------------------------------------: | :-----------------------------------------------------------------------: |
| ![Detail Kantong](https://placehold.co/600x400/FFFFFF/000000?text=Detail+Kantong) | ![Kirim Uang](https://placehold.co/600x400/FFFFFF/000000?text=Kirim+Uang) |

|                                    Riwayat Transaksi                                    |                              Top Up                               |
| :-------------------------------------------------------------------------------------: | :---------------------------------------------------------------: |
| ![Riwayat Transaksi](https://placehold.co/600x400/FFFFFF/000000?text=Riwayat+Transaksi) | ![Top Up](https://placehold.co/600x400/FFFFFF/000000?text=Top+Up) |

## Teknologi yang Digunakan

- **Framework**: [ReactJS](https://reactjs.org/) (dibuat dengan [Vite](https://vitejs.dev/))
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **State Management**: React Context API
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifikasi**: [React Hot Toast](https://react-hot-toast.com/)

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal perangkat lunak berikut di sistem Anda:

- [Node.js](https://nodejs.org/en/) (disarankan v16 atau lebih baru)
- [npm](https://www.npmjs.com/) (biasanya terinstal bersama Node.js)
- Server backend untuk aplikasi ini harus sudah berjalan pada port yang sesuai.

## Instalasi dan Setup

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lingkungan lokal Anda:

1.  **Clone repositori ini:**

    ```bash
    git clone [https://link-ke-repositori-anda.git](https://link-ke-repositori-anda.git)
    cd nama-folder-frontend
    ```

2.  **Instal semua dependensi yang diperlukan:**

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment Variable:**

    - Buat file baru di direktori utama proyek dengan nama `.env`.
    - Tambahkan variabel berikut ke dalam file `.env`:

    ```
    VITE_API_BASE_URL=http://localhost:3000/
    ```

    _Catatan: Pastikan URL ini sesuai dengan alamat server backend Anda yang sedang berjalan._

4.  **Jalankan server development:**

    ```bash
    npm run dev
    ```

5.  Setelah server berhasil berjalan, buka browser dan akses `http://localhost:5173` (atau port lain yang ditampilkan di terminal Anda).

## Struktur Proyek

Proyek ini disusun dengan struktur folder yang modular untuk memudahkan pengembangan, pemeliharaan, dan skalabilitas.

src/
├── api/ # Konfigurasi dan instance Axios terpusat.
├── components/ # Komponen UI yang dapat digunakan kembali di banyak halaman.
│ ├── common/ # Komponen umum seperti Tombol, Input, Modal.
│ └── user/ # Komponen spesifik untuk fitur pengguna.
├── context/ # React Context untuk state management global (misal: Autentikasi).
├── hooks/ # Custom Hooks untuk logika yang dapat digunakan kembali.
├── layouts/ # Komponen tata letak halaman (misal: MainLayout dengan Header & Footer).
├── pages/ # Komponen yang merepresentasikan halaman penuh dalam aplikasi.
│ ├── Auth/
│ ├── User/
│ └── Admin/
├── routes/ # Konfigurasi routing aplikasi menggunakan React Router.
└── ...

## Kontribusi

Kontribusi untuk pengembangan proyek ini sangat kami hargai. Jika Anda ingin berkontribusi, silakan ikuti langkah-langkah berikut:

1.  Fork repositori ini.
2.  Buat branch baru untuk fitur Anda (`git checkout -b fitur/NamaFiturAnda`).
3.  Lakukan perubahan dan commit (`git commit -m 'Menambahkan Fitur X'`).
4.  Push ke branch Anda (`git push origin fitur/NamaFiturAnda`).
5.  Buka sebuah Pull Request untuk ditinjau.

## Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](https://opensource.org/licenses/MIT).
