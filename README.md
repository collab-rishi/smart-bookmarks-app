# Real-Time Bookmark Manager

A full-stack, real-time bookmarking application built with **Next.js 15**, **Supabase**, and **Tailwind CSS**. This project was completed as part of a technical micro-challenge to demonstrate proficiency in server/client component architecture and live database synchronization.

## 🚀 Features

- **Real-Time Sync**: Multiple tabs/windows stay in sync instantly using Supabase Postgres Changes (WebSockets).
- **Optimistic UI**: Local state updates immediately upon bookmark addition for a lag-free experience.
- **Secure Authentication**: Server-side session validation via Next.js Middleware.
- **Row Level Security (RLS)**: Database-level protection ensuring users can only view, create, or delete their own data.
- **Responsive Design**: Fully mobile-responsive UI built with Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## 🧠 Challenges & Solutions

### 1. The "Single Tab" Sync Loop
**Problem**: When adding a bookmark, the "Other Tab" updated perfectly via Realtime, but the "Current Tab" didn't show the new bookmark until a refresh, or it created a duplicate entry when combined with local state.

**Solution**: I implemented **State Lifting**. By moving the bookmark state to a parent `DashboardClient` component, I created a single "Source of Truth." I then added a de-duplication check in the state setter:
```javascript
if (prev.find(b => b.id === newBookmark.id)) return prev;
```

### 2. Database "Silence" (Realtime Not Triggering)
**Problem**: The application successfully subscribed to the channel (status: SUBSCRIBED), but no data was being broadcast when the database changed.

**Solution**: I identified that Supabase tables do not broadcast changes by default for security. I solved this by manually adding the bookmarks table to the supabase_realtime publication using SQL. I also set the REPLICA IDENTITY to FULL to ensure the entire row payload was sent to the client.

### 3. Middleware "Session Ghosting"
**Problem**: Users could briefly see the dashboard UI before the client-side Auth check kicked them back to the login page.

**Solution**: I implemented Next.js Middleware to handle authentication at the edge. By using createServerClient from @supabase/ssr, the session is validated on the server before the page even begins to render, providing a secure and flicker-free user experience.

## 🏗️ Architecture & Logic

### State Lifting
To ensure a seamless experience within a single session, state is "lifted" to a shared `DashboardClient` component. This allows the `BookmarkForm` and `BookmarkList` to share the same source of truth, preventing duplicate entries and ensuring immediate UI updates.

### Real-Time Engine
The application utilizes the Supabase Realtime service. By subscribing to the `postgres_changes` event on the `bookmarks` table, the app "listens" for inserts and deletes specifically filtered by the authenticated `user_id`.



## 🚦 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd bookmark-manager
```
2. Install dependencies
```
Bash
npm install
```

3. Environment Variables
Create a .env.local file in the root directory and add your Supabase credentials:

Code snippet
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. Database Setup
Run the following SQL in your Supabase SQL Editor to enable Realtime:

SQL
```
-- Enable Realtime for the bookmarks table
alter publication supabase_realtime add table bookmarks;

-- Ensure full row data is sent on changes
alter table bookmarks replica identity full;
```

5. Run the app

Bash
```
npm run dev
```

🔒 Security Summary
Middleware: All /dashboard routes are protected server-side.

RLS: The PostgreSQL bookmarks table has RLS enabled with policies for SELECT, INSERT, and DELETE restricted to auth.uid() = user_id.


---

