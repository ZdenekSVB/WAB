# Workout Tracker Application

Tento projekt je full-stack webová aplikace pro sledování cvičení. Je postavena kompletně na TypeScriptu a skládá se z backendu (Express.js) a frontendu (Vue 3).

Projekt byl zaměřen na backendovou část a na práci samostatně na projektu

## 🛠 Použité technologie

### Backend
* Runtime: Node.js
* Framework: Express.js
* Databáze: MongoDB (Mongoose ODM)
* Jazyk: TypeScript
* Autentizace: JWT & Bcrypt
* Real-time komunikace: Socket.io
* Logování: Winston (včetně rotace logů)
* Dokumentace API: Swagger (OpenAPI)
* Testování: Jest & Supertest

### Frontend
* Framework: Vue 3 (Composition API)
* Build Tool: Vite
* UI Knihovna: Vuetify
* State Management: Pinia
* Routing: Vue Router
* HTTP Client: Axios
* Real-time klient: Socket.io-client

---

## 📋 Prerekvizity

* Node.js (doporučena verze 18+)
* npm (nebo pnpm/yarn)
* Běžící instance MongoDB (lokálně nebo v cloudu, např. MongoDB Atlas)

---

## 🚀 Instalace a spuštění

Projekt je rozdělen do dvou složek: `backend` a `frontend`. Každou část je třeba spustit v samostatném terminálu.

### 1. Backend (Server)

Přejděte do složky backendu:
cd backend

Instalace závislostí:
npm install

Konfigurace prostředí (.env):
Vytvořte soubor `.env` v kořeni složky `backend` a nastavte proměnné (příklad):
PORT=4000
SECRET=tajnyklic
MONGO_URI=mongodb+srv://admin:xZbaioxvIxkbUgFd@wab.51phn.mongodb.net/?retryWrites=true&w=majority&appName=WAB
# Pro testování vytvořte také .env.test s TEST_MONGO_URI

Spuštění v dev módu (s hot-reload pomocí nodemon):
npm run dev

Spuštění produkčního buildu:
npm run build
npm start

Backend poběží na: http://localhost:4000 (nebo dle PORT v .env)
API Dokumentace (Swagger): http://localhost:4000/api-docs (po spuštění)

---

### 2. Frontend (Klient)

Přejděte do složky frontendu:
cd frontend

Instalace závislostí:
npm install

Spuštění vývojového serveru:
npm run dev

Aplikace bude dostupná na adrese vypsané v terminálu (obvykle http://localhost:3000 nebo 5173).

Poznámka: Frontend je nakonfigurován tak, aby požadavky na `/api` automaticky přesměroval na backend (http://localhost:4000) díky nastavení proxy ve `vite.config.ts`.

---

## 🧪 Testování (Backend)

Backend obsahuje integrované testy pomocí Jest a Supertest.

Spuštění všech testů:
npm test

Tento příkaz:
1. Nastaví prostředí na `testEnvironment: node`.
2. Načte proměnné z `.env.test`.
3. Spustí testy s timeoutem 30 sekund.
4. Vygeneruje report pokrytí kódu (coverage) ve složce `coverage/` (formáty text a lcov).

---

## 📂 Struktura projektu

.
├── backend/
│   ├── src/
│   │   ├── server.ts      # Vstupní bod
│   │   └── ...
│   ├── tests/             # Jest testy
│   ├── dist/              # Kompilovaný JS kód
│   ├── jest.config.js     # Konfigurace testů
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.vue
    │   ├── main.ts
    │   └── ...
    ├── vite.config.ts     # Konfigurace Vite a Proxy
    └── package.json
