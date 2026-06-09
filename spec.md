# Travesía Rieles del Lago 2026

## Product Overview

Travesía Rieles del Lago 2026 is the official landing page for the first edition of the cycling event. The platform serves as the primary channel for event promotion, participant registration, sponsor visibility, and distribution of race information.

The application SHALL operate without a database and SHALL not persist participant information after processing registrations.

All website content MUST be configurable through JSON files.

---

## Objectives

The platform MUST:

* Promote the cycling event.
* Provide event information.
* Support individual registrations.
* Support team registrations.
* Send confirmation emails to participants.
* Send notification emails to organizers.
* Be fully responsive.
* Be optimized for mobile devices.
* Be deployable as a static frontend with a lightweight backend service.

---

## Technical Requirements

### Frontend

The frontend MUST be developed using:

* React 19+
* Vite
* Tailwind CSS
* Framer Motion
* Lucide React

### Backend

The backend MUST be developed using:

* Node.js
* Express
* Nodemailer

### Infrastructure

The application MUST use an SMTP service for email delivery.

No database technology SHALL be used.

---

## Architecture

```text
┌─────────────────┐
│  React Frontend │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│ Express Backend │
└────────┬────────┘
         │ SMTP
         ▼
┌─────────────────┐
│ SMTP Provider   │
└─────────────────┘
```

The frontend SHALL never have direct access to SMTP credentials.

The backend SHALL be responsible for all email processing.

---

## Content Management

All editable content MUST be loaded from JSON configuration files.

Directory structure:

```text
src/data
├── hero.json
├── countdown.json
├── competition.json
├── details.json
├── articles.json
├── registration.json
├── sponsors.json
├── social.json
├── contact.json
└── footer.json
```

Hardcoded content inside React components is prohibited.

The following information MUST be configurable:

* Event name
* Event edition
* Event date
* Event location
* Event slogan
* Hero video source
* Route information
* Elevation information
* Sponsor information
* Contact information
* Social media links
* Registration settings

---

## Navigation

The application MUST include a sticky navigation bar.

### Desktop Requirements

The navigation bar SHALL:

* Be positioned above the Hero section.
* Use a transparent dark overlay.
* Remain visible while scrolling.
* Display navigation links on the left.
* Display a bicycle icon on the right.

### Mobile Requirements

The navigation bar SHALL:

* Collapse into a hamburger menu.
* Support smooth scrolling navigation.

Menu entries:

* Home
* Competition
* Details
* Articles
* Registration
* Sponsors
* Contact

---

## Hero Section

The Hero section MUST occupy the full viewport height.

### Background Video

The Hero section SHALL support the following video providers:

* YouTube
* Vimeo
* Local MP4 files

Video behavior:

* Autoplay enabled
* Muted enabled
* Loop enabled
* Responsive scaling
* Cover mode enabled

### Content Layout

Left side:

* Event edition

Right side:

* Event date

Center:

* Event logo

Below logo:

* Event slogan

Logo source:

```text
/public/assets/images/logo.png
```

The layout MUST remain usable and visually balanced on mobile devices.

---

## Countdown Section

The Countdown section MUST display:

* Event title
* Event slogan
* Event location
* Event date

A primary CTA button SHALL be displayed.

Button text:

```text
INSCRIBIRME AHORA
```

Button action:

* Scroll to Registration section.

A live countdown SHALL display:

* Days
* Hours
* Minutes
* Seconds

The countdown MUST refresh every second.

```

Este es el formato correcto de un `spec.md`. Sin embargo, para tu proyecto completo faltan todavía aproximadamente las secciones:

- Competition
- Details
- Articles
- Registration
- Validation Rules
- Email Processing
- SMTP Configuration
- Email Templates
- Sponsors
- Footer
- SEO
- Accessibility
- Performance
- Error Handling
- User Flows
- Acceptance Criteria
- Non Functional Requirements
- Out Of Scope
- Future Enhancements
- Definition Of Done

Lo ideal sería generar un único `spec.md` completo de unas **250-350 líneas**, siguiendo este mismo estándar profesional.
```
