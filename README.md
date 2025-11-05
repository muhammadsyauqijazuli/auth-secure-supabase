# Rancang Bangun Sistem Manajemen Password Aman Menggunakan Supabase dan Next.js

Aplikasi manajemen password yang aman menggunakan Next.js 14 dengan App Router dan Supabase sebagai backend. Aplikasi ini memungkinkan pengguna untuk menyimpan dan mengelola password mereka dengan aman menggunakan enkripsi dan autentikasi modern.

## Arsitektur Aplikasi

### Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Forms**: Server Actions (Next.js 14)

### Struktur Direktori
```
app/
├── components/          # Komponen yang dapat digunakan kembali
│   ├── Navbar.jsx      # Navigasi utama
│   └── ...
├── auth/               # Komponen dan logika autentikasi
│   └── confirm/
│       └── route.js
├── login/              # Halaman login
│   ├── actions.js
│   └── page.jsx
├── register/           # Halaman registrasi
│   └── page.jsx
├── private/           # Halaman terproteksi
│   ├── page.jsx
│   └── PasswordManager.jsx
├── home/              # Dashboard utama
│   └── page.jsx
└── utils/             # Utilitas dan konfigurasi
    └── supabase/      # Konfigurasi Supabase
        ├── client.js
        ├── middleware.js
        └── server.js

```

### Fitur Utama
1. 🔐 Autentikasi Aman
   - Login/Register dengan email
   - Proteksi rute berbasis middleware
   - Manajemen sesi terintegrasi

2. 🗄️ Manajemen Password
   - Enkripsi data sensitif
   - CRUD operasi password
   - Organisasi berdasarkan kategori

3. 🎨 UI/UX Modern
   - Responsive design
   - Dark mode support
   - Animasi halus
   - Feedback visual

4. 🛡️ Keamanan
   - Row Level Security (RLS)
   - Enkripsi data
   - Proteksi XSS
   - CSRF Protection

## Instalasi dan Konfigurasi

### Prerequisites
- Node.js 18+ dan npm
- Akun Supabase
- Git

### Langkah 1: Clone dan Instalasi
```bash
# Clone repository
git clone https://github.com/muhammadsyauqijazuli/auth-secure-supabase.git
cd auth-secure-supabase

# Install dependencies
npm install
```

### Langkah 2: Konfigurasi Supabase
1. Buat project baru di [Supabase](https://app.supabase.com)
2. Dapatkan kredensial project (URL dan Anon Key)
3. Buat file `.env.local` di root project:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Langkah 3: Setup Database
1. Buka SQL Editor di Supabase Dashboard
2. Jalankan SQL berikut untuk membuat tabel passwords:
```sql
-- Create passwords table
create table public.passwords (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  title text not null,
  username text not null,
  password text not null,
  url text,
  notes text
);

-- Set up Row Level Security (RLS)
alter table public.passwords enable row level security;

-- Create policies
create policy "Users can only see their own passwords"
  on public.passwords for select
  using (auth.uid() = user_id);

create policy "Users can insert their own passwords"
  on public.passwords for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own passwords"
  on public.passwords for update
  using (auth.uid() = user_id);

create policy "Users can delete their own passwords"
  on public.passwords for delete
  using (auth.uid() = user_id);
```

### Langkah 4: Jalankan Aplikasi
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## Penggunaan

1. **Register/Login**
   - Buat akun baru atau login dengan akun yang ada
   - Verifikasi email (opsional)

2. **Mengelola Password**
   - Tambah password baru
   - Lihat daftar password
   - Edit password yang ada
   - Hapus password

3. **Fitur Keamanan**
   - Password tersimpan dalam format terenkripsi
   - Akses terbatas hanya untuk pemilik data
   - Timeout sesi otomatis

## Teknologi yang Digunakan

### Frontend
- **Next.js 14**: Framework React dengan server-side rendering
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: State management
- **Server Actions**: Form handling dan mutations

### Backend & Database
- **Supabase**: Backend-as-a-Service
  - Authentication
  - PostgreSQL Database
  - Row Level Security
  - Real-time subscriptions

### Security
- **Encryption**: Data enkripsi end-to-end
- **JWT**: Token-based authentication
- **RLS**: Row Level Security di database
- **CORS**: Cross-Origin Resource Sharing protection

## Deployment

### Deploy ke Vercel
1. Push kode ke GitHub repository
2. Buat akun di [Vercel](https://vercel.com)
3. Import project dari GitHub
4. Tambahkan environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

## Kontribusi

Kontribusi selalu welcome! Silakan buat pull request atau buka issue untuk perbaikan atau peningkatan fitur.

## Lisensi

Project ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## Author

Muhammad Syauqi Jazuli - [GitHub](https://github.com/muhammadsyauqijazuli)
