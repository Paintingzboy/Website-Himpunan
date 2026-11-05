// data-utils.js
// Fungsi bantu yang dipakai bersama oleh halaman publik & admin.

// Escape teks sebelum dimasukkan ke innerHTML (mencegah tampilan rusak / XSS)
export function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>'"]/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[s]));
}

// Hanya izinkan link http/https (mencegah "javascript:" dsb.)
export function safeUrl(url) {
    const u = String(url ?? '').trim();
    return /^https?:\/\//i.test(u) ? u : '';
}

// Ubah link Google Drive / Imgur menjadi link gambar langsung.
// Format lama drive.google.com/uc?export=view sudah tidak bisa dipakai di <img>,
// jadi diganti ke endpoint thumbnail.
export function normalizeImageUrl(url) {
    const u = safeUrl(url);
    if (!u) return '';
    const driveMatch = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || u.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (u.includes('drive.google.com') && driveMatch) {
        return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1600`;
    }
    const imgur = u.match(/^https?:\/\/(?:www\.)?imgur\.com\/(?:gallery\/|a\/)?([a-zA-Z0-9]+)(?:\.(png|jpe?g|gif|gifv|webp))?$/i);
    if (imgur) {
        const ext = imgur[2] ? imgur[2].toLowerCase().replace('gifv', 'gif') : 'jpg';
        return `https://i.imgur.com/${imgur[1]}.${ext}`;
    }
    return u;
}

// Ambil waktu (ms) dari field createdAt. Dokumen tanpa createdAt dianggap 0.
export function waktuMs(ts) {
    if (!ts) return 0;
    if (typeof ts.toMillis === 'function') return ts.toMillis();
    if (typeof ts.seconds === 'number') return ts.seconds * 1000;
    const t = new Date(ts).getTime();
    return isNaN(t) ? 0 : t;
}

// Urutkan dokumen terbaru dulu, di sisi browser.
// Sengaja TIDAK memakai orderBy('createdAt') di query Firestore, karena orderBy
// otomatis membuang dokumen yang tidak punya field createdAt (mis. data yang
// diinput manual lewat Firebase Console) sehingga data "hilang" di website.
export function urutkanTerbaru(snap) {
    const arr = [];
    snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
    return arr.sort((a, b) => waktuMs(b.createdAt) - waktuMs(a.createdAt));
}

// Pesan error yang bisa dibaca manusia
export function pesanError(err) {
    if (err?.code === 'permission-denied') {
        return 'Akses data ditolak oleh Firestore Security Rules. Admin perlu mengizinkan baca publik (lihat firestore.rules).';
    }
    if (err?.code === 'unavailable') {
        return 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
    }
    return err?.message || 'Terjadi kesalahan.';
}
