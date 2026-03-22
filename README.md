# FitBook — SEG3125 Lab 8

Fitness appointment booking web app built with React.

## Setup

```bash
npm install
npm run dev
```

## Dependencies

```bash
npm install react-router-dom
```

## Project Structure

```
src/
├── styles/
│   └── global.css          # CSS variables, fonts, shared styles
├── components/
│   ├── Navbar.jsx           # Shared navbar (all pages)
│   └── Navbar.css
├── pages/
│   ├── AppointmentsPage.jsx # My Appointments dashboard
│   ├── AppointmentsPage.css
│   ├── ContactPage.jsx      # Contact Us page
│   └── ContactPage.css
└── App.jsx                  # Router setup
```

## Pages

| Page | Route | Owner |
|------|-------|-------|
| Home | `/` | TBD |
| Book | `/book` | TBD |
| Appointments | `/appointments` | Zahabia |
| Contact Us | `/contact` | Zahabia |
| Profile | `/profile` | TBD |

## Design

- Matches Lab 7 Figma: [Link](https://www.figma.com/design/i8BLhajSPt1sFEd6AuxsGz/)
- Color: `#E8521A` orange accent on `#C8BFAA` beige background
- Font: Bebas Neue (headings) + DM Sans (body)

## Human Interactive Processes Covered

- **Following Instructions** — 4-step booking flow with progress stepper
- **Planning** — Calendar + time slot selection
- **Monitored Activity** — Appointments dashboard with Upcoming/Past tabs
- **Communicating** — Contact page with form + contact info
- **Exploring** — Service and trainer browsing cards
