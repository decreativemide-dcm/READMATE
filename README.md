# READMATE

A mobile-first reading accountability PWA prototype built with React, Vite, Framer Motion and Lucide icons.

## Run it online
1. Open https://stackblitz.com/
2. Choose **Import Project** (or upload this ZIP in a supported online IDE).
3. If prompted, select the `readmate` folder.
4. Run `npm install`, then `npm run dev` (StackBlitz usually starts the dev server automatically).

You can also create a new Vite React project and replace its files with the contents of this folder.

## Current prototype
- Five working navigation destinations: Home, Courses, Materials, Notes, Me.
- Responsive desktop and mobile layouts.
- Reading dashboard with sample streak and partner data.
- Daily reflection modal; submitted reflections appear in Notes.
- Sample course shelf and resource library.
- PWA manifest starter.

## Important prototype limitations
All user names, dates, reading progress, partner activity and streak values are sample/demo data. Data is held in browser memory and resets on refresh. There is no authentication, database, real invitation flow, cross-device sync, push notification or verified streak calculation yet. The add-resource and settings actions are placeholders.

## Next milestone
Connect Supabase after the data model and partnership rules are agreed. Add real authentication, invitation tokens, partnership membership, daily logs, notes, comments, and server-side streak calculation. Configure PWA icons and service-worker caching before production deployment.
