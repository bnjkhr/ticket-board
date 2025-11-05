# TODO - Ticket Board

## 🔥 High Priority

- [x] **Drag & Drop zwischen Spalten**
  - Tickets per Drag & Drop verschieben (z.B. mit `@dnd-kit/core`)
  - Smooth Animationen

- [x] **Ticket bearbeiten**
  - Edit-Modal für bestehende Tickets
  - Alle Felder editierbar (Titel, Beschreibung, Priority, Labels)

- [ ] **Passwort zurücksetzen**
  - "Passwort vergessen?" Link im Login
  - Firebase Password Reset Flow

## 🎯 Medium Priority

- [ ] **Suche & Filter**
  - Volltextsuche in Tickets (Titel + Beschreibung)
  - Filter nach Status, Priority, Labels
  - Kombinierbare Filter

- [ ] **Listen-Ansicht**
  - Alternative zur Kanban-Ansicht
  - Sortierbar nach Datum, Priority, Status
  - Toggle zwischen Board/List View

- [ ] **Dark Mode**
  - Theme Switcher im Header
  - System-Theme erkennen
  - Preference speichern (localStorage)

- [ ] **Markdown-Support**
  - Markdown-Editor für Ticket-Beschreibungen
  - Preview-Modus
  - Syntax-Highlighting für Code-Blöcke

- [ ] **Ticket-Details-Seite**
  - Eigene Route für jedes Ticket (`/ticket/[id]`)
  - Mehr Platz für längere Beschreibungen
  - Später: Kommentare, Attachments, History

## 💡 Nice to Have

- [ ] **Email-Verifizierung**
  - Nach Registrierung Email-Bestätigung erforderlich
  - Re-send Verification Email Button

- [ ] **Ticket-Archivierung**
  - Archiv-Status zusätzlich zu Done
  - Archivierte Tickets ausblenden (mit Toggle)

- [ ] **Bulk-Actions**
  - Multiple Tickets auswählen
  - Batch-Delete, Batch-Status-Change, Batch-Label-Add

- [ ] **Ticket-Templates**
  - Vordefinierte Templates (Bug Report, Feature Request, etc.)
  - Custom Templates erstellen

- [ ] **Export/Import**
  - Export zu JSON/CSV
  - Backup-Funktion
  - Import von anderen Tools (z.B. GitHub Issues CSV)

- [ ] **Keyboard Shortcuts**
  - `N` - Neues Ticket
  - `Cmd/Ctrl + K` - Suche
  - `Escape` - Modals schließen
  - Arrow Keys - Navigation

- [ ] **Statistiken & Analytics**
  - Dashboard mit Ticket-Metriken
  - Zeitverlauf (Tickets pro Woche/Monat)
  - Durchschnittliche Zeit in jedem Status

## 🐛 Bug Fixes & Improvements

- [ ] **Loading States verbessern**
  - Skeleton Loaders für Tickets
  - Besseres Feedback bei Network-Errors

- [ ] **Error Handling**
  - Toast-Notifications für Erfolg/Fehler
  - Bessere Fehlermeldungen bei Firebase-Errors
  - Retry-Mechanismus bei Netzwerkfehlern

- [ ] **Responsive Design optimieren**
  - Mobile Navigation (Hamburger Menu?)
  - Touch-freundlichere Buttons
  - Bessere Ticket-Cards auf kleinen Screens

- [ ] **Performance**
  - Lazy Loading für Komponenten
  - Virtualized List für viele Tickets (z.B. `react-window`)
  - Images optimieren (wenn wir später Attachments haben)

- [ ] **Accessibility (a11y)**
  - Keyboard-Navigation überall
  - Screen-Reader Support
  - Focus-States verbessern
  - ARIA-Labels ergänzen

## 🔧 Technical Debt

- [ ] **Tests schreiben**
  - Unit Tests (Jest/Vitest)
  - Integration Tests (React Testing Library)
  - E2E Tests (Playwright)

- [ ] **Firestore Query optimieren**
  - Pagination für große Ticket-Mengen
  - Caching-Strategie

- [ ] **Error Boundaries**
  - React Error Boundaries hinzufügen
  - Graceful Degradation

- [ ] **TypeScript strict mode**
  - Alle `any` Types entfernen
  - Stricter Type-Checking

- [ ] **Code-Splitting**
  - Dynamic Imports für Modals
  - Route-based Code Splitting

## 📚 Documentation

- [ ] **API-Dokumentation**
  - Firestore Datenmodell dokumentieren
  - Funktions-Signaturen dokumentieren (JSDoc)

- [ ] **Component Storybook**
  - Storybook Setup
  - Stories für alle Komponenten

- [ ] **Contributing Guide**
  - Wenn andere mithelfen sollen

## 🚀 DevOps & Deployment

- [ ] **CI/CD Pipeline**
  - GitHub Actions für Tests
  - Automatic Deployment auf Push zu `main`
  - Preview-Deployments für PRs

- [ ] **Environment-spezifische Configs**
  - Dev/Staging/Production Environments
  - Separate Firebase-Projekte

- [ ] **Monitoring & Logging**
  - Sentry oder ähnliches für Error-Tracking
  - Analytics (z.B. Vercel Analytics)

---

## 🎨 Design-Ideen

- [ ] Custom Theme Colors (User-konfigurierbar)
- [ ] Animationen und Transitions
- [ ] Confetti-Animation bei Ticket → Done
- [ ] Custom Fonts
- [ ] Illustrationen für Empty States

---

**Legende:**
- 🔥 High Priority - Sollte bald umgesetzt werden
- 🎯 Medium Priority - Nützlich, aber nicht kritisch
- 💡 Nice to Have - Future Features
- 🐛 Bug Fixes - Verbesserungen am bestehenden Code
- 🔧 Technical Debt - Code-Qualität & Wartbarkeit
- 📚 Documentation - Dokumentation
- 🚀 DevOps - Infrastructure & Deployment
