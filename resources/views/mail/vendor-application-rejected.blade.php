<x-mail::message>
# Halo, {{ $name }}

Terima kasih telah mendaftarkan brand **{{ $brandName }}** ke {{ config('app.name') }}.

Setelah melalui proses review, kami menyampaikan bahwa aplikasi Anda **belum dapat kami setujui** pada saat ini.

Hal ini bisa disebabkan oleh dokumen yang belum lengkap atau belum memenuhi persyaratan kami.

Anda dapat mendaftar kembali kapan saja dengan melengkapi persyaratan yang diperlukan di halaman pendaftaran.

Jika ada pertanyaan, silakan hubungi tim kami melalui halaman Kontak di situs kami.

Salam,<br>
Tim {{ config('app.name') }}
</x-mail::message>
