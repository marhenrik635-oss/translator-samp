# SAMP RP Translator — Anti-Kaku English Roleplay Translator

Website translator khusus Roleplay GTA San Andreas Multiplayer (SAMP) & GTA RP yang **ANTI-KAKU (tidak seperti Google Translate)**. Dirancang dengan LLM reasoning engine untuk menerjemahkan percakapan jalanan, slang komunitas motor / gang, mekanik, hingga format aksi `/me` dan kondisi `/do`.

---

## ✨ Fitur Utama

1. **Anti-Kaku (Zero Google Translate Stiffnes)**:
   - Memahami bahasa gaul Indonesia: *"cepu"*, *"silop"*, *"sotot"*, *"cabut"*, *"jebol"*, *"geber mesin"*, *"kompo"*, *"beceng"*, *"santai"*, dsb.
   - Mengubah kalimat menjadi English street talk yang hidup dan natural.

2. **Persona & Subkultur Roleplay**:
   - 🏍️ **UK Biker & Rocker (Ace Cafe London)**: Harold Ortega style, Triumph, Norton, thumper, ton-up, mate, innit, built not bought (diintegrasikan langsung dari file `List Slank.txt`).
   - 🔫 **West Coast Hood Gang**: Grove / Ballas style, homie, dog, turf, heat, piece, ain't, 12/fuzz.
   - 🇲🇽 **Chicano Vato**: Julian Dalopez style, lowrider, chopper, vato, carnal, esse, cabron.
   - 🔧 **Mechanic / Garage**: Bengkel motor & mobil, mesin, bodywork, torque, scrap components, repair.
   - 🚔 **Police / SAPD**: Radio 10-codes (10-4, 10-20), instruksi taktis penegakan hukum.
   - 🕶️ **Italian Mafia**: Wise guy, capisce, business, fella.
   - 💬 **Casual Street**: Bahasa gaul sehari-hari yang luwes.

3. **Format Aksi SAMP Otomatis**:
   - `says:` percakapan normal
   - `shouts:` teriakan
   - `whispers:` bisikan
   - `/me`: Aksi orang ketiga waktu sekarang (`* Harold Ortega reaches into...`)
   - `/do`: Deskripsi kondisi fisik/lingkungan (`(( The engine is smoking heavily... ))`)

4. **Simulasi SAMP In-Game Chat Box**:
   - Preview visual persis seperti di dalam game GTA SAMP (warna hex `#c2a2da` untuk `/me`, `#ffffff` untuk `says:`, timestamp real-time, font monospace console).
   - Tombol 1-Click Copy (Copy English Polos atau Copy Format Chat SAMP).

5. **Kamus Slang Interaktif (`List Slank.txt` & SAMP Glossary)**:
   - Termasuk seluruh istilah biker & cafe racer dari `List Slank.txt` (Blimey, Ton, Throttle, Kickstart, Thumper, Custom, Built not bought, Flat out, dll).
   - Fitur pencarian instan dan tombol salin/gunakan.

---

## 🚀 Cara Menjalankan di Lokal

1. Buka terminal di folder ini (`D:/Folderku/Translator`):
   ```bash
   npm run dev
   ```
2. Buka browser di [http://localhost:3000](http://localhost:3000).
3. Langsung ketik kalimat bahasa Indonesia dan klik **"TERJEMAHKAN KE BAHASA RP"** (atau tekan `Ctrl + Enter`).

---

## 🌐 Cara Deploy ke Vercel (vercel.app)

Aplikasi ini dibuat menggunakan **Next.js (App Router)** yang 100% kompatibel dan siap di-deploy ke Vercel tanpa konfigurasi rumit.

### Opsi A: Menggunakan GitHub + Vercel Web Dashboard (Paling Mudah)
1. Push project ini ke repository GitHub Anda (bisa public atau private):
   ```bash
   git init
   git add .
   git commit -m "feat: initial SAMP RP translator"
   git branch -M main
   git remote add origin <url-repo-github-anda>
   git push -u origin main
   ```
2. Buka [https://vercel.com](https://vercel.com), login, dan klik **"Add New Project"**.
3. Import repository GitHub tersebut.
4. *(Opsional)* Tambahkan Environment Variables jika ingin mengubah default:
   - `DEFAULT_LLM_ENDPOINT`: `https://rnrbmqc.abc-tunnel.us/v1`
   - `DEFAULT_LLM_API_KEY`: `sk-dccd02cc8ccf53e8-zqx07k-0f0bc410`
   - `DEFAULT_LLM_MODEL`: `oc/mimo-v2.6-flash-free`
5. Klik **"Deploy"**. Website Anda akan langsung aktif di `https://nama-project-anda.vercel.app`.

### Opsi B: Menggunakan Vercel CLI Langsung dari Terminal
```bash
npx vercel
```
Ikuti petunjuk di layar, tekan Enter untuk default, dan project akan langsung ter-deploy ke vercel.app.

---

## ⚙️ Model LLM & Backup Engine

- **Model Utama**: `oc/mimo-v2.6-flash-free`
- **Endpoint**: `https://rnrbmqc.abc-tunnel.us/v1`
- **Auto-Fallback Engine**: Jika model utama sedang sibuk atau error, sistem otomatis mencoba model backup yang tersedia:
  - `oc/deepseek-v4-flash-free`
  - `oc/glm-5.3-flash-free`
  - `oc/nemotron-3.5-lightning-free`
- **Settings Modal**: Anda juga bisa mengganti endpoint, API key, atau memilih model lain langsung dari icon gear di website tanpa perlu edit kode!
