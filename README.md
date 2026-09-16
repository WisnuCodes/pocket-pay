# Format Presentasi Portofolio (Untuk Canva)

Berikut adalah struktur konten presentasi yang disesuaikan persis dengan format terbaru Anda. Format ini sangat cocok untuk membedah project **Mini Wallet App** secara mendalam (*Business Perspective* & *Technical Depth*).

---

## BAGIAN 1: INTRODUCTION

### Slide 1: Cover & Self-Overview
**Judul Presentasi:** Meningkatkan Pengalaman Digital: Portofolio Full-Stack Web Developer
**Headline:** Halo! Saya Wisnu Nugraha
**Deskripsi (Self-Overview):**
Selamat datang! Saya Wisnu Nugraha, seorang Full Stack Web Developer. Semangat saya dalam menciptakan pengalaman pengguna yang menarik menjadi pendorong utama pekerjaan saya, memungkinkan saya untuk mengubah berbagai ide menjadi aplikasi web yang fungsional, aman, dan mudah digunakan.

---

## BAGIAN 2: MAIN PROJECT - BUSINESS PERSPECTIVE

### Slide 2: Problem Statement
**Masalah nyata apa yang diselesaikan?**
Pengguna sering kali membutuhkan aplikasi pencatatan dan pengelolaan keuangan sederhana yang tidak hanya aman, tetapi juga memiliki antarmuka (UI) yang mudah dipahami tanpa alur yang rumit.
**Siapa yang terdampak?**
Pengguna individu (User) yang menginginkan simulasi akses dan kontrol yang cepat atas dompet digital mereka.
**Dampak jika masalah ini tidak diselesaikan:**
Pengguna akan kembali ke pencatatan manual yang rentan terhadap kesalahan (*human error*) dan lambat dalam melacak riwayat transaksi.

### Slide 3: Target User & Value Proposition
**Target Pengguna:**
Individu, mahasiswa, atau *freelancer* yang membutuhkan platform dompet digital praktis dan ringan untuk mengelola transaksi harian.
**Masalah Utama (Pain Points):**
Aplikasi keuangan yang terlalu kompleks untuk kebutuhan sederhana, serta kurangnya transparansi pada riwayat transaksi.
**Nilai Jual (Value Proposition):**
Mini Wallet App menawarkan transaksi instan (Top-up & Transfer) dengan antarmuka *Single Page Application* yang super responsif tanpa memuat ulang halaman (*loading*), riwayat aktivitas yang transparan, dan sistem keamanan berlapis berbasis Cookie (Sanctum).

### Slide 4: Business Model (Product Thinking)
**B2C (Business to Consumer):**
Aplikasi ini berpotensi dikembangkan menjadi layanan dompet digital langsung kepada pengguna akhir (*end-user*).
*(Potensi Pengembangan: Model Freemium, atau pengenaan biaya admin mikro per transaksi transfer antar pengguna)*.

### Slide 5: Impact & Scalability
**Efisiensi Waktu & Biaya:**
Menyediakan pengalaman transaksi (Top-Up dan Transfer) secara instan dalam hitungan detik, mendemonstrasikan kelancaran alur keuangan digital modern.
**Potensi Skalabilitas:**
- **Lebih Banyak Pengguna:** Arsitektur *API* dirancang secara modular sehingga siap jika nantinya diakses oleh banyak pengguna aktif bersamaan.
- **Lebih Banyak Data:** Skema database dirancang efisien dan terelasi untuk menampung data riwayat transaksi dalam jumlah besar.
- **Fitur Tambahan:** Struktur *codebase* sangat siap diekspansi untuk penambahan layanan nyata seperti *Payment Gateway* (Midtrans/Stripe).

---

## BAGIAN 3: MAIN PROJECT - TECHNICAL DEPTH

### Slide 6: Tech Stack Overview
**Mengapa menggunakan React (Frontend)?**
Karena React memungkinkan pembuatan antarmuka pengguna berbasis komponen (*Component-Based*) dan beroperasi sebagai *Single Page Application* (SPA), membuat navigasi aplikasi terasa sangat mulus dan interaktif.
**Mengapa backend menggunakan Laravel?**
Laravel menyediakan ekosistem yang solid dengan fitur *routing* RESTful, *Eloquent ORM*, dan sistem keamanan bawaan (Laravel Sanctum) yang sangat ideal untuk aplikasi finansial.
**Mengapa memilih database ini (MySQL)?**
MySQL sangat penting untuk aplikasi finansial agar bisa memanfaatkan fitur **Database Transactions** guna menjamin prinsip ACID (Atomicity, Consistency, Isolation, Durability) — mencegah error atau hilangnya saldo saat terjadi kegagalan sistem ketika proses transfer.

### Slide 7: System Architecture
**Sorotan (Highlight):** 
Menggunakan arsitektur *Client-Server* terpisah (Decoupled) di mana Frontend (React) berinteraksi dengan Backend (Laravel) sepenuhnya melalui REST API.

**Use Case Diagram (Auth & Core):**
*(Gunakan area ini di Canva untuk menempelkan foto/diagram Use Case atau User Flow)*
`[Masukkan Gambar Use Case Diagram di sini]`

- **Aksi Pengguna:** *Register*, *Login*, *Topup*, *Transfer*, *View History*.
- Seluruh fitur utama memiliki relasi *<<include>>* ke *Login*, memastikan sistem memblokir akses dari pengguna yang tidak memiliki otorisasi.

### Slide 8: Key Technical Challenges & Solutions
**Tantangan 1: Autentikasi & Keamanan**
- **Solusi:** Implementasi **Laravel Sanctum** (Autentikasi berbasis *Cookie Stateful*) & enkripsi *password* menggunakan **Bcrypt**.
- **Dampak:** Melindungi API dari akses ilegal, serangan *CSRF*, dan eksploitasi data sesi pengguna.

**Tantangan 2: State Management & Race Conditions**
- **Solusi:** Menggunakan **React Context API** dan **Custom Hooks** (`useAuth`, `useWallet`) untuk *Global State*, serta mendisable tombol (*loading state*) saat menunggu respons dari server.
- **Dampak:** Alur data aplikasi sangat rapi, dan sistem berhasil menghindari transaksi ganda (seperti klik *Transfer* dua kali berturut-turut).

**Tantangan 3: Penanganan Error (Error Handling)**
- **Solusi:** Menerapkan **Global Error Interceptors** menggunakan Axios di sisi *Frontend*.
- **Dampak:** Pesan error dari server (contoh: *Saldo tidak cukup*) dapat ditangkap secara otomatis dan ditampilkan sebagai notifikasi pop-up yang informatif bagi pengguna.

### Slide 9: Database Design
**Sorotan: ERD & Relasi Tabel**
*(Gunakan area ini di Canva untuk menempelkan foto Entity Relationship Diagram)*
`[Masukkan Gambar ERD di sini]`

Desain tabel berpusat pada normalisasi dan efisiensi:
1. **Tabel `users`:** Menyimpan profil dan data login pengguna.
2. **Tabel `wallets`:** (Relasi *One-to-One* dengan User). Bertugas khusus menyimpan saldo akhir (*balance*), mempercepat proses cek saldo tanpa perlu menghitung ulang riwayat transaksi.
3. **Tabel `transactions`:** (Relasi *One-to-Many* dengan Wallet). Berfungsi sebagai *ledger* yang mencatat detail nominal, tipe (Top-Up/Transfer), serta pihak yang terlibat.

### Slide 10: API Design & Best Practices
**Sorotan (Highlight):**
- **Struktur RESTful:** Setiap *endpoint* dinamai secara semantik sesuai fungsinya (contoh: `POST /api/wallet/topup`, `GET /api/transactions`).
- **HTTP Status Code:** Penggunaan kode status API yang berstandar internasional (*200 OK*, *401 Unauthorized*, *422 Unprocessable Entity*, *500 Internal Server Error*).
- **Validasi Ketat:** Sistem backend secara ketat menolak input *amount* bernilai negatif atau format yang tidak valid melalui **Laravel Form Requests**, memastikan hanya data yang bersih yang masuk ke database.
