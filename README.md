# File Storing & Sharing System + Notes Manager

Egy modern, biztonságos és reszponzív személyes felhő alapú fájlmegosztó és jegyzetkezelő platform. A projekt egy egyfelhasználós adminisztrációs felületet biztosít, ahol a felhasználók biztonságosan tárolhatják, rendszerezhetik és megoszthatják fájljaikat, valamint követhetik napi jegyzeteiket/feladataikat.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.1-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-S3_Compatible-F38020?style=flat-square&logo=cloudflare)](https://www.cloudflare.com/products/r2/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat-square&logo=sqlite)](https://sqlite.org/)

---

## Főbb Funkciók

### 1. Fájl- és Mappakezelés (Cloudflare R2 alapokon)
- **Hierarchikus Mappaszerkezet:** Mappák létrehozása, belépés almappákba, visszalépés (`..`), valamint mélységi navigáció.
- **Drag-and-Drop Feltöltés:** Gyors és kényelmes fájlfeltöltés a `react-dropzone` segítségével a kiválasztott mappába.
- **Biztonságos Letöltés (Presigned URL):** A fájlok letöltéséhez a backend ideiglenes, 5 perc után lejáró aláírt URL-t generál, megakadályozva a jogosulatlan hozzáférést.
- **Megtisztított fájlnevek:** Automatikus ékezetmentesítés és speciális karakterek eltávolítása a biztonságos felhőtárolás érdekében.
- **Vizuális Fájltípusok:** Testreszabott ikonok megjelenítése a fájlkiterjesztések alapján (PDF, ZIP, Kép, Zene, Videó stb.).
- **Törlés megerősítéssel:** Interaktív, egyedi megerősítő felugró ablak (Toast) a véletlen törlések megelőzésére.

### 2. Jegyzet- és Feladatkezelés
- **Teljes CRUD:** Jegyzetek hozzáadása, törlése és listázása időrendben.
- **Státuszváltás (Active/Inactive):** A jegyzetekre kattintva egyszerűen áthúzhatók (elkészültnek jelölhetők), amely állapot mentődik az adatbázisban.
- **Helyi Időbélyegzés:** Minden jegyzet automatikusan elmenti a létrehozás pontos magyarországi idejét (`Europe/Budapest` időzóna alapján).

### 3. Hitelesítés és Biztonság
- **Egyfelhasználós Rendszer:** Ideális személyes használatra, ahol a hitelesítési adatok (e-mail, bcrypt hash jelszó) környezeti változókban vannak definiálva.
- **Token alapú munkamenet:** Biztonságos JSON Web Token (JWT) alapú azonosítás. A token 1 nap után lejár.
- **Védett API Végpontok:** Minden fájl- és jegyzetművelet mögött álló Express útvonalat JWT-hitelesítési middleware véd.

### 4. Felhasználói Élmény (UI/UX)
- **Perszisztens Sötét/Világos mód:** A felhasználó által választott téma elmentődik a böngésző `localStorage`-ében.
- **Modern Animációk:** Finom és prémium átmenetek, töltési animációk (Spinners), lebegési (hover) effektek.
- **Toast Értesítések:** Azonnali visszajelzés sikeres feltöltésekről, törlésekről vagy hibákról.

---

## Alkalmazott Technológiák

### Frontend
- **React 19** & **Vite** (HMR és rendkívül gyors build folyamatok)
- **Tailwind CSS v4.0** (Modern, deklaratív stílusrendszer)
- **React Router v7** (Kliensoldali útvonalválasztás és elrendezések)
- **React Icons** (Modern vektorgrafikus ikoncsomagok)
- **React Toastify** (Figyelemfelkeltő értesítési rendszer)

### Backend
- **Node.js** & **Express (v5.1)** (API szerver és útvonalak)
- **AWS SDK v3 (`@aws-sdk/client-s3`)** (Közvetlen kapcsolat a Cloudflare R2 / S3 tárhellyel)
- **Multer** (Memóriapuffer alapú fájlfogadás az S3-ba történő közvetlen továbbításhoz)
- **Bcrypt** (Jelszó-összehasonlítás)
- **JSONWebToken (JWT)** (Munkamenet kezelés)

### Adatbázisok
- **SQLite (`better-sqlite3`):** Helyi, fájlalapú működéshez (alapértelmezett).
- **Cloudflare D1:** Támogatás szerver nélküli (Serverless / Cloudflare Workers) környezetben történő futtatáshoz (a `USE_D1=true` kapcsolóval).

---

## Projekt Felépítése

```
fileSharingWeb/
├── backend/                   # Express Backend Szerver
│   ├── config/
│   │   ├── db.js              # Adatbázis-kapcsolat kezelő (SQLite vagy D1)
│   │   ├── initSqlite.js      # SQLite adatbázis inicializáló script
│   │   └── schema.sql         # Adatbázis sémadefiníció
│   ├── controllers/
│   │   ├── authController.js  # JWT-alapú bejelentkezési logika
│   │   ├── fileController.js  # R2/S3 fájlkezelési műveletek
│   │   └── noteController.js  # Jegyzet-kezelési műveletek
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT ellenőrző middleware
│   ├── routes/
│   │   ├── authRoutes.js      # Hitelesítési API útvonalak
│   │   ├── fileRoutes.js      # Fájlkezelő API útvonalak
│   │   └── noteRoutes.js      # Jegyzetkezelő API útvonalak
│   ├── utils/
│   │   └── s3.js              # S3/R2 kliens konfiguráció
│   ├── notes.db               # SQLite adatbázisfájl (automatizáltan jön létre)
│   ├── server.js              # Express szerver belépési pont
│   └── wrangler.toml          # Cloudflare Worker konfigurációs fájl
├── public/                    # Statikus frontend eszközök (pl. favicon)
├── src/                       # Frontend Alkalmazás (React)
│   ├── assets/                # Statikus assetek
│   ├── components/            # Újrafelhasználható UI komponensek
│   │   ├── FileComponent.jsx  # Fájlok megjelenítése és letöltés/törlés kezelése
│   │   ├── FolderComponent.jsx# Mappák navigációja
│   │   ├── LoginButton.jsx    # Be-/kijelentkezés gomb
│   │   ├── NewFolderComponent.jsx # Új mappa gomb és beviteli mező
│   │   ├── SidePanel.jsx      # Oldalsó navigációs panel
│   │   ├── ThemeToggler.jsx   # Téma váltó (Sötét/Világos)
│   │   └── ToastWithButtons.jsx # Egyedi jóváhagyó toast
│   ├── contexts/
│   │   └── UserContext.jsx    # Globális felhasználói állapot (Auth)
│   ├── layouts/
│   │   ├── AuthLayout.jsx     # Bejelentkező oldal elrendezése
│   │   └── MainLayout.jsx     # Főoldali és belső oldali keretrendszer
│   ├── pages/
│   │   ├── HomePage.jsx       # Fájlkezelő böngésző felület
│   │   ├── LoginPage.jsx      # Bejelentkező felület
│   │   ├── NotesPage.jsx      # Jegyzetek listázása és kezelése
│   │   └── UploadPage.jsx     # Fájlfeltöltő felület
│   ├── App.jsx                # Téma- és kontextus-kezelő fő komponens
│   ├── index.css              # Globális stílusok és Tailwind beállítások
│   └── main.jsx               # React Router inicializáció és mountolás
├── generate-hash.js           # Segédscript a biztonságos jelszó-hash előállításához
├── index.html                 # Frontend HTML sablon
├── package.json               # Fő függőségek és script indítók (frontend és backend közös csomagjai)
├── vite.config.js             # Vite build és Tailwind plugin konfiguráció
└── README.md                  # Projekt leírás és útmutató
```

---

## Beállítás és Környezeti Változók (.env)

A szerver futtatásához hozz létre egy `.env` fájlt a **`backend/`** könyvtárban az alábbi mintának megfelelően:

```env
# Cloudflare R2 / S3 Beállítások
SECRET_ACCESS_KEY=a074d48ffcd2a47a5b6ec... # R2 Secret Access Key
ACCESS_KEY_ID=8249eb847d2878c9f...         # R2 Access Key ID
BUCKET=cloudstorage                        # R2 Bucket neve
ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com

# Hitelesítés és Biztonság
JWT_SECRET=Nagyon_titkos_kulcs             # Egyedi JWT aláíró kulcs
EMAIL=pelda@email.com                      # Bejelentkezési e-mail cím
HASHED_PASSWORD=$2b$10$...                 # Bcrypt-tel hash-elt jelszó

# Cloudflare D1 Adatbázis Beállítások (csak ha USE_D1=true)
USE_D1=false                               # Használjon-e Cloudflare D1-et
CF_ACCOUNT_ID=                             # Cloudflare Account ID
CF_API_TOKEN=                              # Cloudflare API Token
D1_DB_NAME=notesdb                         # D1 Adatbázis neve
```

> [!WARNING]
> Soha ne töltsd fel a valós `.env` fájlt semmilyen nyilvános verziókövető rendszerbe (a `.gitignore` fájl már alapértelmezetten tartalmazza).

---

## Jelszó Hash Generálása

Mivel a rendszer egy előre beállított, biztonságosan hash-elt jelszóval működik, a `.env` fájlban lévő `HASHED_PASSWORD` mezőhöz generálnod kell egy bcrypt hash-t.

Ehhez használd a gyökérkönyvtárban lévő segédscriptet:

```bash
# Futtasd a projekt gyökerében megadva a kívánt jelszót:
node generate-hash.js "sajat_titkos_jelszavam"
```

A script kiírja a generált hash-t (pl. `$2b$10$...`), ezt másold be a `backend/.env` fájl `HASHED_PASSWORD` kulcsához.

---

## Telepítés és Helyi Futtatás

### 1. Függőségek Telepítése
A projekt közös függőségi fájlt használ a gyökérben, így elegendő egyetlen parancsot futtatni:

```bash
# Telepítés a projekt gyökerében
npm install
```

### 2. Adatbázis Inicializálása (Helyi SQLite-hoz)
Futtasd az SQLite adatbázis-kezelő tábla-létrehozó scriptet, ami automatikusan elkészíti a `notes.db` adatbázist a backend mappájában:

```bash
# SQLite inicializálása
node backend/config/initSqlite.js
```

### 3. Backend indítása
Nyiss meg egy terminált, és indítsd el az Express API szervert:

```bash
# Szerver indítása (alapértelmezetten a 5000-es porton fog futni)
node backend/server.js
```

### 4. Frontend indítása
Nyiss meg egy másik terminált, és indítsd el a Vite fejlesztői szerverét:

```bash
# Frontend indítása fejlesztői módban
npm run dev
```

Ezután nyisd meg a böngésződben a terminálban jelzett címet (általában `http://localhost:5173`).

---

## Telepítés Éles Környezetbe (Deployment)

### Frontend (pl. Vercel vagy Netlify)
A frontend könnyen telepíthető bármelyik statikus tárhelyszolgáltatóra.
- **Build parancs:** `npm run build`
- **Kimeneti mappa:** `dist`
- A projekt gyökerében található `vercel.json` már konfigurálva van a helyes kliensoldali útvonalak átirányítására.

### Backend (pl. Render, Railway vagy Cloudflare Workers)
- **Render / Railway:** Telepíthető hagyományos Node.js web-service-ként a `backend/server.js` fájllal. Ügyelj rá, hogy a környezeti változók (.env tartalom) a szolgáltató felületén legyenek beállítva.
- **Cloudflare Workers:** A projekt fel van készítve a Cloudflare Workers és D1 / R2 natív kiszolgálására. A `wrangler.toml` fájlban beállítható a worker fő belépési pontja (`backend/server.js`), valamint a D1 adatbázis összekapcsolása.
