# Travesía Rieles del Lago 2026

Landing page for the first edition of the cycling event "Travesía Rieles del Lago".

## Structure

- `/src`: React 19 Frontend (Vite, Tailwind, Framer Motion)
- `/src/data`: JSON configuration files for all website content
- `/server`: Express Backend (Nodemailer for registration processing)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

### Running the Project

1. Start the backend:
   ```bash
   cd server
   npm run dev
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

## Content Management

All website content is managed via JSON files in `src/data/`. No code changes are needed to update event information, dates, categories, or sponsor logos.
