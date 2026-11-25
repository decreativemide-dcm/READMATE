# READMATE

**Read together. Grow together.**

READMATE is a social reading platform designed to help readers build consistent reading habits, stay accountable, and connect with people who share their passion for learning.

Built with **React, Vite, Supabase, Framer Motion, and Lucide React**, READMATE combines personal reading management with social accountability in a simple, responsive experience.

## Features

- **Personal Reading Dashboard** – Track your reading activities and stay focused on your goals.
- **Reading Buddies** – Discover other readers, send connection requests, and build accountability partnerships.
- **Real-time Messaging** – Communicate with your connected reading buddy.
- **Custom Avatars** – Choose from a collection of illustrated avatars to personalize your profile.
- **Notes and Reflections** – Capture thoughts, reflections, and important lessons from your reading journey.
- **Learning Materials** – Organize and access useful reading resources.
- **Notifications** – Stay updated on reading buddy requests and other activities.
- **Responsive Interface** – Enjoy a consistent experience across desktop and mobile devices.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| Vite | Development and build tooling |
| Supabase | Authentication, database, and backend services |
| Framer Motion | Animations and transitions |
| Lucide React | Interface icons |
| CSS | Responsive styling |

## Getting Started

### Prerequisites

- Node.js and npm
- A Supabase project
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/decreativemide-dcm/READMATE.git
```

Navigate into the project directory:

```bash
cd READMATE
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and configure your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your Supabase project credentials.

**Security:** Never commit your `.env` file or expose Supabase service-role keys in frontend code.

### Run Locally

Start the development server:

```bash
npm run dev
```

Build the application for production:

```bash
npm run build
```

## Deployment

READMATE can be deployed using platforms such as Vercel.

For a Vercel deployment:

1. Import the READMATE GitHub repository.
2. Select Vite as the framework preset.
3. Configure the required Supabase environment variables.
4. Deploy the application.

## Project Status

READMATE is actively under development. Features, interface components, and backend functionality are being refined as the platform evolves.

Some functionality may require further development, testing, or configuration before production use.

## Vision

READMATE aims to make reading more consistent, engaging, and social by helping people stay accountable, share knowledge, and grow together through books and learning.

**Read more. Stay consistent. Grow together.**

---

Developed with purpose by **De Creative Mide**.
