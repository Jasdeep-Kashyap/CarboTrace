# CarboTrace - Project Memory & Context

This document serves as a living memory file for any AI assistant working on the CarboTrace project. 
**Instructions for AI:** Please read this file to understand the project context. Update this file as you make significant architectural decisions, complete milestones, or learn important project-specific patterns.

## 1. Project Overview
CarboTrace is a Waste-to-Carbon (W2C) credit tracking application. It tracks the lifecycle of waste from collection to recycling and mints verified carbon credits.

## 2. Tech Stack & Architecture
- **Framework:** React + Vite (Note: Older docs mentioned Next.js App Router, but recent configuration is using Vite).
- **Styling:** Tailwind CSS, shadcn/ui (Initialization in progress).
- **Backend/DB:** Supabase (Auth via JWT/RLS, Postgres + PostGIS for geofencing, Storage, Realtime).
- **Serverless API:** Supabase Edge Functions & RPCs.
- **Language:** TypeScript.

## 3. User Roles & Flows
- **Generator:** Logs waste, uploads verification photos.
- **Driver:** Follows route map, geofenced stops (50m), logs weight, issues receipt.
- **Recycler:** Claims batch, logs processing methods and yield.
- **Checker (Auditor):** Reviews logs and mints carbon credits.
- **Buyer:** Marketplace access to buy and retire credits.
- **Admin:** Manages platform, disputes, and organizations.
- **Public:** Views dashboard, footprint calculators, and leaderboard.

## 4. Guidelines & Rules
1. Ensure strict **TypeScript** and **Zod** validation on all routes and components.
2. Keep Supabase queries secure using **Row Level Security (RLS)**.
3. Separate UI components into reusable **shadcn/ui** structures (located in `src/components`).
4. Follow the standard API response envelope: `{ ok, data, meta }` or `{ ok, error }`.

## 5. Current State & Recent Changes
- Initialized Tailwind CSS and updated `vite.config.ts` and `index.css`.
- Configured path aliases (`@/*` -> `./src/*`) in `tsconfig.json`.
- `shadcn-ui` is currently being initialized.
- A draft prompt for Claude was created to help bootstrap the database schema and roadmap.

## 6. Open Tasks / TODOs
- Finalize database schema (`database_schema.md` is currently empty).
- Define project roadmap (`Roadmap.md` is currently empty).
- Complete shadcn setup and build base layout components.
