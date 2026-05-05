# El Sendero

> El camino del guerrero. App comunitaria de fitness gamificado para corredores nocturnos de Salta.

## Stack

- **Frontend:** React + Vite (PWA instalable)
- **Backend:** Firebase (Auth · Firestore · Realtime Database · Storage)
- **Maps:** Leaflet + OpenStreetMap
- **Deploy:** GitHub Pages / Firebase Hosting

## Setup

```bash
# 1. Clonar
git clone https://github.com/JesusBattiato/el-sendero.git
cd el-sendero

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Configurar Firebase
cp .env.example .env.local
# Completar .env.local con las credenciales del proyecto Firebase

# 4. Correr en desarrollo
npm run dev
```

## Firebase requerido

- Authentication → Email link (passwordless)
- Firestore Database
- Realtime Database
- Storage

Ver instrucciones de configuración en `/docs` (próximamente).

## Estructura

```
src/
├── lib/
│   ├── firebase.js       # Config Firebase
│   ├── AuthContext.jsx   # Auth + perfil
│   └── wisdom.js         # Frases del Guerrero de la Luz
├── pages/
│   ├── LoginPage.jsx     # Magic link
│   ├── OnboardingPage.jsx # 5 pasos de inicio
│   ├── VigilPage.jsx     # Pantalla principal (esta noche)
│   ├── GuardiaPage.jsx   # Tu guardia geográfica
│   └── ArcoPage.jsx      # Arco narrativo semanal
└── index.css             # Design system completo
```
