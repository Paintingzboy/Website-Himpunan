// firebase-config.js
// Gunakan format CDN (bukan npm) karena project ini Vanilla HTML

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// 1. Tambahkan import Firestore di sini
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyAlkaRGfxI-Wfir2-yjpw__kjmWm3xBdA8",
    authDomain:        "himatekins-web.firebaseapp.com",
    projectId:         "himatekins-web",
    storageBucket:     "himatekins-web.firebasestorage.app",
    messagingSenderId: "62164224896",
    appId:             "1:62164224896:web:9f92a67fa967921bdb4f65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// 2. Tambahkan export db agar bisa dipakai di file admin.html & layanan.html
export const db = getFirestore(app);