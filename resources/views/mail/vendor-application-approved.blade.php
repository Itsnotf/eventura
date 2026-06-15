<x-mail::message>
# Selamat, {{ $name }}!

Aplikasi vendor **{{ $brandName }}** Anda di **Eventura** telah **disetujui**.

Akun Anda sudah aktif. Klik tombol di bawah untuk mengatur password dan mulai mengelola profil brand Anda.

<x-mail::button :url="$resetUrl" color="primary">
Atur Password & Masuk
</x-mail::button>

Link di atas berlaku selama 60 menit. Jika sudah kedaluwarsa, gunakan fitur "Lupa Password" di halaman login.

Setelah masuk, Anda bisa langsung melengkapi profil brand, menambahkan paket layanan, dan portofolio.

Terima kasih telah bergabung bersama Eventura!

Salam,<br>
Tim {{ config('app.name') }}
</x-mail::message>
