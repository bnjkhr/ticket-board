# Ticket Board

Ein mandantenfähiges Ticket-Management-System für Indie-Entwickler, gebaut mit Next.js 15 und Firebase.

## Features

- **Multi-User Support**: Jeder User hat seine eigenen Tickets und Labels
- **Firebase Authentication**: Sichere Anmeldung mit E-Mail/Passwort
- **Kanban Board**: Visualisiere deine Tickets in drei Spalten (Todo, In Progress, Done)
- **Ticket-Management**: Erstelle, bearbeite und lösche Tickets
- **Labels**: Organisiere Tickets mit farbigen Labels
- **Prioritäten**: Setze Prioritäten (Low, Medium, High)
- **Real-time Updates**: Automatische Synchronisation mit Firebase Firestore
- **Responsive Design**: Funktioniert auf Desktop und Mobile
- **Datentrennung**: Vollständige Mandantentrennung - User sehen nur ihre eigenen Daten

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase Firestore
- **Hosting**: Vercel

## Setup

### 1. Repository klonen

```bash
git clone <dein-repo-url>
cd ticket-board
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Firebase konfigurieren

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle ein neues Projekt oder nutze ein bestehendes
3. Aktiviere **Firestore Database** im Firebase-Projekt
4. Aktiviere **Authentication** → **Sign-in method** → **Email/Password**
5. Kopiere deine Firebase-Konfiguration (Project Settings → General → Your apps)

### 4. Environment Variables einrichten

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.local.example .env.local
```

Füge deine Firebase-Credentials ein:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Development Server starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Deployment auf Vercel

### Automatisches Deployment

1. Push deinen Code zu GitHub
2. Gehe zu [Vercel](https://vercel.com)
3. Importiere dein GitHub Repository
4. Füge die Environment Variables hinzu (siehe `.env.local.example`)
5. Deploy!

Vercel erkennt automatisch Next.js und konfiguriert das Build-Setup.

### Environment Variables in Vercel

Gehe zu: **Project Settings → Environment Variables** und füge folgende Variablen hinzu:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Firestore Security Rules

**WICHTIG**: Die Security Rules müssen in der Firebase Console eingerichtet werden!

1. Gehe zu Firebase Console → Firestore Database → Rules
2. Kopiere den Inhalt aus `firestore.rules` und füge ihn ein
3. Klicke auf "Publish"

Die Rules stellen sicher, dass:
- Nur authentifizierte User auf Daten zugreifen können
- Jeder User nur seine eigenen Tickets und Labels sehen/bearbeiten kann
- Vollständige Datentrennung zwischen Users gewährleistet ist

**Hinweis**: Ohne diese Rules können User potenziell auf die Daten anderer User zugreifen!

## Projektstruktur

```
ticket-board/
├── app/
│   ├── layout.tsx          # Root Layout mit AuthProvider
│   ├── page.tsx             # Homepage mit Auth-Gate
│   └── globals.css          # Globale Styles
├── components/
│   ├── AuthForm.tsx         # Login/Register UI
│   ├── Board.tsx            # Kanban Board
│   ├── TicketCard.tsx       # Einzelne Ticket-Karte
│   ├── CreateTicketModal.tsx # Modal zum Erstellen von Tickets
│   ├── CreateTicketButton.tsx
│   ├── Header.tsx           # Navigation Header mit Logout
│   └── LabelManager.tsx     # Label-Verwaltung
├── contexts/
│   └── AuthContext.tsx      # Firebase Auth Context
├── lib/
│   ├── firebase.ts          # Firebase Initialisierung (Auth + Firestore)
│   └── firestore.ts         # Firestore CRUD Funktionen (User-spezifisch)
├── types/
│   └── ticket.ts            # TypeScript Typen
├── firestore.rules          # Firestore Security Rules
└── .env.local.example       # Beispiel für Environment Variables
```

## Erste Schritte nach Deployment

1. Öffne deine deployed App
2. Klicke auf "Registrieren"
3. Erstelle einen Account mit E-Mail und Passwort
4. Erstelle dein erstes Ticket!

## Nächste Schritte / Erweiterungen

- [x] Firebase Authentication mit Email/Passwort
- [x] Multi-User Support mit Mandantentrennung
- [x] Firestore Security Rules
- [ ] Drag & Drop für Tickets zwischen Spalten
- [ ] Filter und Suche
- [ ] Markdown-Editor für Ticket-Beschreibungen
- [ ] Dark Mode
- [ ] Listen-Ansicht als Alternative zum Board
- [ ] Export-Funktion (CSV, JSON)
- [ ] Ticket-Historie und Kommentare
- [ ] Passwort zurücksetzen Funktion
- [ ] Email-Verifizierung

## Lizenz

MIT
