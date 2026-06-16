# Eventura — Perbaikan Batch (email, site-settings, navbar)

> Fokus sesi ini: **#1 (email)** & **#2 (site-settings)** diperbaiki tuntas, plus **bug kecil navbar #3**. **Redesign publik (#3) DITUNDA** sesuai permintaan — dikerjakan setelah #1 & #2 (lihat §4 untuk diagnosis & arah). Kode di bawah sudah dicocokkan dengan kondisi repo terkini.

## Ringkasan akar masalah

| # | Gejala | Akar masalah sebenarnya |
|---|---|---|
| 1 | Email approve/reject tidak diterima | Notifikasi `implements ShouldQueue` + `QUEUE_CONNECTION=database` tanpa worker → mengendap di tabel `jobs`, tak pernah terkirim. **Dan** `MAIL_MAILER=log` → kalaupun terkirim, hanya ke file log, bukan inbox. |
| 2 | Form site-settings UX rendah; field gambar = input string | `SiteSettingsController::update` hanya menyimpan string & **tidak menangani upload**; form me-render type `image` sebagai input teks; tak ada keterangan field. **+ Temuan baru: key mismatch & seeder duplikat** (lihat §3.0). |
| 3 | Beranda = Explore; link Kontak hilang di nav desktop | `welcome.tsx` nyaris salinan `explore.tsx`; di `landing-layout.tsx`, link Kontak hanya ada di menu mobile, tidak di nav `md+`. |

---

## §1. Perbaikan #1 — Email approve & reject

Dua langkah: (A) hentikan email tersangkut di antrian, (B) konfigurasi pengiriman nyata.

### 1A. Kirim notifikasi secara sinkron (jangan lewat antrian)

Selama tidak ada worker `queue:work` berjalan, notifikasi `ShouldQueue` tidak akan pernah terkirim. Untuk aksi admin volume-rendah seperti approve/reject, kirim langsung jauh lebih andal. **Hapus `ShouldQueue` dari kedua notifikasi.**

**`app/Notifications/VendorApplicationApproved.php`** dan **`app/Notifications/VendorApplicationRejected.php`** — ubah:

```php
// HAPUS baris import ini:
use Illuminate\Contracts\Queue\ShouldQueue;

// UBAH deklarasi class (di kedua file):
// dari:
class VendorApplicationApproved extends Notification implements ShouldQueue
// menjadi:
class VendorApplicationApproved extends Notification
```

```php
// VendorApplicationRejected.php — sama:
class VendorApplicationRejected extends Notification
```

> Alternatif (kalau ingin tetap pakai antrian): biarkan `ShouldQueue`, tapi set `QUEUE_CONNECTION=sync` di `.env`, **atau** jalankan worker `php artisan queue:work`. Rekomendasi: hapus `ShouldQueue` agar tidak bergantung pada worker.

### 1B. Konfigurasi pengiriman email yang nyata

`MAIL_MAILER=log` hanya menulis email ke `storage/logs/laravel.log` — **tidak** mengirim ke inbox. Pilih sesuai kebutuhan:

**Opsi A — Verifikasi lokal (Mailpit, direkomendasikan untuk dev):** email "tertangkap" & bisa dilihat di UI Mailpit (`http://localhost:8025`), tanpa terkirim ke alamat asli.
```env
MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="no-reply@eventura.id"
MAIL_FROM_NAME="Eventura"
```

**Opsi B — Benar-benar sampai ke email pribadi (SMTP nyata).** Karena Anda menguji dengan email pribadi dan ingin menerimanya betulan, gunakan SMTP transaksional (mis. Brevo/Resend/SendGrid free tier, atau Gmail App Password). Contoh (sesuaikan kredensial):
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USERNAME=__smtp_user__
MAIL_PASSWORD=__smtp_key__
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@domainanda.com"
MAIL_FROM_NAME="Eventura"
```

> Catatan: Mailpit/Mailtrap hanya **menangkap** email (bagus untuk uji isi), tidak mengantar ke alamat asli. Untuk benar-benar mendarat di inbox Gmail Anda, pakai Opsi B.

Perbarui juga **`.env.example`** agar default-nya mengarahkan ke Mailpit (lebih jujur daripada `log`), dan dokumentasikan di README bahwa mail wajib dikonfigurasi.

**Selesai bila:** approve & reject mengirim email yang benar-benar terlihat (di Mailpit / inbox), tidak tersangkut di tabel `jobs`.

---

## §2. (digabung ke §3)

---

## §3. Perbaikan #2 — Halaman Pengaturan Situs

### 3.0 — Perbaiki dulu: key mismatch & seeder duplikat (temuan baru, penting)

**Masalah:** seeder yang dipanggil `DatabaseSeeder` adalah `SiteSettingSeeder` (singular) yang memakai key **titik** (`about.body`, `about.image`, `contact.maps_embed`). Tapi halaman publik membaca key **garis-bawah** (`about_title`, `about_description`, `contact_email`, …). Akibatnya **halaman publik Tentang/Kontak hanya menampilkan teks fallback**, bukan data yang admin isi. Ada pula `SiteSettingsSeeder` (plural) dengan key garis-bawah yang justru cocok, tapi tidak dipanggil.

**Solusi:** satukan ke **satu** seeder dengan key garis-bawah (yang dipakai halaman), tambah `about_image` & `contact_maps`, panggil di `DatabaseSeeder`, dan hapus duplikatnya.

**`database/seeders/SiteSettingsSeeder.php`** (jadikan ini satu-satunya, key konsisten):
```php
<?php
namespace Database\Seeders;

use App\Models\SiteSettings;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // group, key, type, label, value, sort
            ['about',   'about_title',       'text',     'Judul Halaman Tentang Kami', 'Tentang Eventura', 1],
            ['about',   'about_tagline',     'text',     'Tagline', 'Platform terpercaya untuk menemukan EO & WO profesional di Indonesia', 2],
            ['about',   'about_description', 'textarea', 'Deskripsi', "Eventura adalah marketplace yang menghubungkan calon klien dengan Event Organizer (EO) dan Wedding Organizer (WO) profesional di seluruh Indonesia.\n\nKami memudahkan pencarian, perbandingan, dan komunikasi antara klien dengan vendor terverifikasi.", 3],
            ['about',   'about_vision',      'textarea', 'Visi', 'Menjadi platform marketplace EO & WO terdepan di Indonesia.', 4],
            ['about',   'about_mission',     'textarea', 'Misi', "- Memudahkan menemukan & membandingkan vendor.\n- Menjamin kualitas lewat verifikasi.\n- Membangun ekosistem yang transparan.", 5],
            ['about',   'about_image',       'image',    'Gambar Utama (opsional)', '', 6],

            ['contact', 'contact_title',     'text',     'Judul Halaman Kontak', 'Hubungi Kami', 1],
            ['contact', 'contact_intro',     'textarea', 'Paragraf Pembuka', 'Ada pertanyaan atau ingin berkolaborasi? Silakan hubungi kami.', 2],
            ['contact', 'contact_email',     'email',    'Email', 'hello@eventura.id', 3],
            ['contact', 'contact_phone',     'text',     'Nomor Telepon / WhatsApp', '+62 812-0000-0000', 4],
            ['contact', 'contact_address',   'textarea', 'Alamat', 'Jakarta, Indonesia', 5],
            ['contact', 'contact_hours',     'text',     'Jam Operasional', 'Senin – Jumat, 09.00 – 17.00 WIB', 6],
            ['contact', 'contact_instagram', 'url',      'Instagram', 'https://instagram.com/eventura.id', 7],
            ['contact', 'contact_maps',      'textarea', 'Google Maps (URL Embed)', '', 8],
        ];

        foreach ($settings as [$group, $key, $type, $label, $value, $sort]) {
            SiteSettings::firstOrCreate(
                ['key' => $key],
                ['group' => $group, 'type' => $type, 'label' => $label, 'value' => $value, 'sort' => $sort]
            );
        }
    }
}
```
- **`DatabaseSeeder`:** ganti `SiteSettingSeeder::class` → `SiteSettingsSeeder::class`.
- **Hapus** file `database/seeders/SiteSettingSeeder.php` (yang singular).
- Untuk DB yang sudah terisi key titik: jalankan `SiteSettings::truncate()` lalu seed ulang, **atau** migration kecil yang me-rename key lama → baru.

### 3.1 — Field gambar: jadikan upload sungguhan (bukan string)

**Keputusan:** saya pilih **menggunakan gambar dengan upload yang benar** (bukan string, bukan dihapus). Gambar bersifat opsional — kalau kosong, halaman Tentang tampil tanpa gambar.

**`app/Http/Controllers/SiteSettingsController.php`** — ganti `update()` agar menangani file:
```php
public function update(Request $request)
{
    $request->validate([
        'settings'         => ['required', 'array'],
        'settings.*.id'    => ['required', 'integer', 'exists:site_settings,id'],
        'settings.*.value' => ['nullable', 'string', 'max:10000'],
        'images'           => ['nullable', 'array'],
        'images.*'         => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
    ]);

    // Field teks
    foreach ($request->input('settings', []) as $item) {
        SiteSettings::where('id', $item['id'])->update(['value' => $item['value'] ?? '']);
    }

    // Field gambar (di-key berdasarkan id setting)
    foreach ($request->file('images', []) as $settingId => $file) {
        if (!$file) continue;
        $path = $file->store('site', 'public'); // storage/app/public/site/...
        SiteSettings::where('id', (int) $settingId)->update(['value' => $path]);
    }

    SiteSettings::clearCache();
    return back()->with('success', 'Pengaturan situs berhasil disimpan.');
}
```
> Pastikan `php artisan storage:link` sudah dijalankan agar `asset('storage/...')` dapat diakses.

### 3.2 — Form admin: UX jelas + keterangan field + preview gambar

Ganti **`resources/js/pages/site-settings/index.tsx`** dengan versi yang: dikelompokkan (Tentang / Kontak), tiap field punya **keterangan**, gambar pakai **file picker + preview**, dan input bertipe tepat.

```tsx
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Setting {
    id: number;
    group: 'about' | 'contact';
    key: string;
    type: 'text' | 'textarea' | 'email' | 'url' | 'image';
    label: string;
    value: string | null;
}
interface Props { settings: Setting[] }

// Keterangan ramah-awam per field (terutama yang jarang dipakai)
const HINTS: Record<string, string> = {
    about_image: 'Gambar utama di halaman Tentang Kami. Format JPG/PNG/WEBP, maks 5MB. Kosongkan jika tidak ingin pakai gambar.',
    contact_maps:
        'Tempel URL EMBED Google Maps. Caranya: buka Google Maps → cari lokasi → tombol "Bagikan" → tab "Sematkan peta" → salin nilai pada atribut src (URL yang diawali https://www.google.com/maps/embed?...). Kosongkan jika tidak ingin menampilkan peta.',
    contact_instagram: 'URL lengkap akun, contoh: https://instagram.com/akunanda',
    contact_phone: 'Nomor yang bisa dihubungi/WhatsApp, contoh: +62 812-3456-7890',
};

const GROUP_LABEL: Record<string, string> = { about: 'Halaman Tentang Kami', contact: 'Halaman Kontak' };

export default function SiteSettingsIndex({ settings }: Props) {
    const [values, setValues] = useState<Record<number, string>>(
        Object.fromEntries(settings.map((s) => [s.id, s.value ?? '']))
    );
    const [images, setImages] = useState<Record<number, File | null>>({});
    const [previews, setPreviews] = useState<Record<number, string>>({});
    const [processing, setProcessing] = useState(false);

    const groups = ['about', 'contact'] as const;

    function pickImage(id: number, file: File | null) {
        setImages((p) => ({ ...p, [id]: file }));
        setPreviews((p) => ({ ...p, [id]: file ? URL.createObjectURL(file) : '' }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        setProcessing(true);
        const payload: Record<string, unknown> = {
            _method: 'put',
            settings: settings.map((s) => ({ id: s.id, value: values[s.id] ?? '' })),
        };
        const imgs: Record<number, File> = {};
        Object.entries(images).forEach(([id, f]) => { if (f) imgs[Number(id)] = f; });
        if (Object.keys(imgs).length) payload.images = imgs;

        router.post('/site-settings', payload, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success('Pengaturan situs berhasil disimpan.'),
            onError: () => toast.error('Gagal menyimpan. Periksa kembali isian Anda.'),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Pengaturan Situs', href: '/site-settings' }]}>
            <Head title="Pengaturan Situs" />
            <form onSubmit={submit} className="p-4 max-w-3xl mx-auto space-y-8">
                <div>
                    <h1 className="text-xl font-semibold">Pengaturan Situs</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola isi halaman <b>Tentang Kami</b> dan <b>Kontak</b>. Perubahan langsung tampil di situs publik.
                    </p>
                </div>

                {groups.map((g) => (
                    <section key={g} className="rounded-xl border bg-card p-5 space-y-5">
                        <h2 className="text-base font-semibold border-b pb-2">{GROUP_LABEL[g]}</h2>
                        {settings.filter((s) => s.group === g).map((s) => (
                            <div key={s.id} className="space-y-1.5">
                                <Label htmlFor={`s-${s.id}`}>{s.label}</Label>
                                {HINTS[s.key] && <p className="text-xs text-muted-foreground">{HINTS[s.key]}</p>}

                                {s.type === 'image' ? (
                                    <div className="space-y-2">
                                        {(previews[s.id] || values[s.id]) && (
                                            <img
                                                src={previews[s.id] || `/storage/${values[s.id]}`}
                                                alt="Pratinjau"
                                                className="h-32 w-auto rounded-lg border object-cover"
                                            />
                                        )}
                                        <Input
                                            id={`s-${s.id}`}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(e) => pickImage(s.id, e.target.files?.[0] ?? null)}
                                        />
                                    </div>
                                ) : s.type === 'textarea' ? (
                                    <Textarea
                                        id={`s-${s.id}`}
                                        rows={s.key === 'contact_maps' ? 3 : 5}
                                        value={values[s.id] ?? ''}
                                        onChange={(e) => setValues((p) => ({ ...p, [s.id]: e.target.value }))}
                                    />
                                ) : (
                                    <Input
                                        id={`s-${s.id}`}
                                        type={s.type === 'email' ? 'email' : s.type === 'url' ? 'url' : 'text'}
                                        value={values[s.id] ?? ''}
                                        onChange={(e) => setValues((p) => ({ ...p, [s.id]: e.target.value }))}
                                    />
                                )}
                            </div>
                        ))}
                    </section>
                ))}

                <Button type="submit" disabled={processing}>
                    {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                </Button>
            </form>
        </AppLayout>
    );
}
```

### 3.3 — Tampilkan gambar & peta di halaman publik

**`resources/js/pages/landing/tentang-kami.tsx`** — render gambar bila ada:
```tsx
const image = get(settings, 'about_image'); // path relatif, mis. "site/abc.jpg"
// ...di dalam JSX, di atas/atau samping deskripsi:
{image && (
    <img src={`/storage/${image}`} alt={title}
         className="w-full max-h-80 object-cover rounded-2xl mb-8" />
)}
```

**`resources/js/pages/landing/kontak.tsx`** — render peta bila ada (pakai URL embed di `src`, aman tanpa dangerouslySetInnerHTML):
```tsx
const maps = get(settings, 'contact_maps');
{maps && (
    <div className="mt-8 rounded-2xl overflow-hidden border">
        <iframe src={maps} title="Lokasi" width="100%" height="320"
                style={{ border: 0 }} loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
    </div>
)}
```

**Selesai bila:** form admin rapi & berketerangan; gambar diunggah via file picker dengan preview (bukan string); halaman publik Tentang/Kontak menampilkan data yang admin isi (key sudah cocok), termasuk gambar & peta bila diisi.

---

## §4. Perbaikan #3 — bug navbar sekarang, redesign DITUNDA

### 4.1 — Tambah link "Kontak" ke nav desktop (perbaiki sekarang)
**Kondisi:** di `resources/js/layouts/landing-layout.tsx`, link Kontak hanya ada di menu mobile, tidak di nav `md+`.
**Aksi:** tambahkan satu link setelah "Tentang Kami" di blok `hidden md:flex` (sekitar baris 32-34):
```tsx
<Link href="/kontak" className="text-lp-on-surface-variant hover:text-lp-primary transition-colors text-sm font-semibold tracking-wide">
    Kontak
</Link>
```
**Selesai bila:** link Kontak tampil di navbar pada layar md ke atas.

### 4.2 — Beranda vs Explore (DITUNDA — kita rancang setelah #1 & #2)
**Diagnosis:** `welcome.tsx` (386 baris) saat ini hampir salinan `explore.tsx` (376 baris) — search + filter + grid yang sama, sehingga beranda & explore tidak berbeda. Permintaan "content-first" diterjemahkan jadi "beranda = explore", padahal yang Anda mau beranda yang **to the point soal fungsi situs** tapi tetap punya identitas berbeda dari halaman explore penuh.

Agar langkah redesign nanti tepat sasaran, mohon arahan ringkas:
1. **Peran beranda vs explore:** apakah beranda jadi *halaman masuk* (hero ringkas + kategori EO/WO + segelintir vendor unggulan + CTA "Jelajahi Semua" → `/explore`), sedangkan `/explore` tetap direktori filter-penuh? Atau Anda ingin beranda & explore **dilebur** jadi satu halaman saja (hapus salah satu)?
2. **Pembeda utama** yang ingin langsung terlihat di beranda: kategori layanan? vendor unggulan/terverifikasi? alur "cara kerja"? pencarian cepat?
3. Setelah halaman Tentang/Kontak (dari §3) jadi, apakah keduanya juga ditautkan dari **footer** beranda?

Setelah Anda jawab, saya rancang ulang hirarki beranda yang benar-benar beda dari explore dan to-the-point.

---

## §5. Catatan eksekusi
- Jalankan setelah menerapkan §3.0: `php artisan migrate` (jika ada perubahan) lalu seed ulang site settings (`SiteSettings::truncate()` + `db:seed --class=SiteSettingsSeeder`) agar key lama (titik) terganti key baru (garis-bawah).
- Setelah ubah `.env` mail, jalankan `php artisan config:clear`.
- Uji #1 end-to-end: daftar vendor → admin approve & reject → cek email tiba (Mailpit/inbox), bukan di tabel `jobs`.
- Uji #2: edit semua field di `/site-settings`, unggah gambar, simpan → buka `/tentang-kami` & `/kontak` pastikan tampil sesuai.
