```markdown
# 📝 Simple Blog Articles with Next.js

Proyek ini adalah implementasi sederhana dari aplikasi blog menggunakan **Next.js**, dengan dukungan manajemen artikel, editor teks, dan peran pengguna (**Admin** dan **User**). Aplikasi ini juga terintegrasi dengan API eksternal untuk pengambilan data.

## 🔧 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Styling:** Tailwind CSS
- **Form Management:** `react-hook-form` + `zod`
- **Editor:** `react-quill-new`
- **Table Component:** `@tanstack/react-table`
- **Authentication:** LocalStorage-based `authContext`
- **Icons:** `lucide-react`
- **HTTP Client:** `axios`
- **UI Components:** `@radix-ui` library (dialog, select, popover, dll)

## 🚀 Features

- 🔐 **Authentication & Role-based Access**

  - Pengguna login dan informasi auth disimpan di `localStorage`.
  - Pemisahan tampilan dan fitur berdasarkan role (Admin vs User).

- 📄 **Blog Article Management**

  - Admin dapat membuat, mengedit, dan menghapus artikel.
  - User hanya dapat melihat daftar artikel.

- ✍️ **Rich Text Editor**

  - Editor artikel dengan dukungan teks menggunakan `react-quill-new`.

- 📊 **Data Table**

  - Tabel dinamis menggunakan `@tanstack/react-table` dengan fitur sorting, searching, dan pagination.

- 🎨 **UI Components**
  - Komponen interaktif seperti dialog, popover, dan select menggunakan `@radix-ui`.

## 📁 Project Structure
```

/components → Reusable components (tables, forms, dialogs, etc.)
/contexts → AuthContext (penyimpanan role dan user dengan localStorage)
/hooks → Custom hooks (misalnya, useAuth)
/pages → Routing halaman (home, login, dashboard, dll.)
/services → Konfigurasi axios dan fungsi API call
/utils → Helper functions

````

## 🔐 Role System

- **Admin**
  - Bisa mengakses dashboard
  - Bisa membuat, mengedit, dan menghapus artikel
- **User**
  - Hanya bisa melihat daftar artikel

> Role dan informasi user disimpan di `localStorage` melalui `AuthContext`.

## 🌐 API

Semua data artikel diambil dari:

📍 [`https://test-fe.mysellerpintar.com/api-docs`](https://test-fe.mysellerpintar.com/api-docs)

Gunakan `axios` untuk melakukan pengambilan dan manipulasi data.

## 🧪 Dependencies

```json
"dependencies": {
  "@hookform/resolvers": "^5.0.1",
  "@radix-ui/react-dialog": "^1.1.13",
  "@radix-ui/react-label": "^2.1.6",
  "@radix-ui/react-popover": "^1.1.13",
  "@radix-ui/react-select": "^2.2.4",
  "@radix-ui/react-slot": "^1.2.2",
  "@tanstack/react-table": "^8.21.3",
  "@tiptap/pm": "^2.12.0",
  "axios": "^1.9.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "html-react-parser": "^5.2.5",
  "lucide-react": "^0.510.0",
  "next": "15.3.2",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-hook-form": "^7.56.3",
  "react-quill-new": "^3.4.6",
  "tailwind-merge": "^3.3.0",
  "zod": "^3.24.4"
}
````

## ▶️ Getting Started

### 1. Install dependencies

```bash
npm install
# atau
yarn install
```

### 2. Jalankan development server

```bash
npm run dev
# atau
yarn dev
```

### 3. Buka di browser

```
http://localhost:3000
```

## 📌 Catatan Tambahan

- Pastikan role pengguna disimpan dalam format yang aman (meskipun menggunakan localStorage).
- Untuk deployment, gunakan platform seperti **Vercel** atau **Netlify**.

## 🧑‍💻 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request jika ingin menambahkan fitur baru atau memperbaiki bug.
