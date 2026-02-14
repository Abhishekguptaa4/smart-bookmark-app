# Smart Bookmark Manager

A secure and modern bookmark manager built using Next.js, Supabase, and Tailwind CSS.  
Users can sign up and log in using Google OAuth and manage their personal bookmarks with real-time updates.

---

## Live Demo
https://smart-bookmark-194t9g70p-abhishek-guptas-projects-1f59b79c.vercel.app


---

## GitHub Repository

https://github.com/Abhishekguptaa4/smart-bookmark-app

---

## Features

- Google OAuth authentication (Sign up and Login)
- Add new bookmarks (Title and URL)
- Edit bookmarks
- Delete bookmarks with confirmation
- Real-time bookmark updates without refreshing page
- Bookmarks are private to each user
- Professional and responsive UI
- Secure backend using Supabase Row Level Security
- Fully deployed on Vercel

---

## Tech Stack

Frontend:
- Next.js 16 (App Router)
- Tailwind CSS
- TypeScript

Backend:
- Supabase Authentication
- Supabase PostgreSQL Database
- Supabase Realtime

Deployment:
- Vercel

---

## Database Schema

Table name: bookmarks

Columns:

- id (uuid, primary key)
- user_id (uuid, references auth.users)
- title (text)
- url (text)
- created_at (timestamp)
- updated_at (timestamp)

---

## Security

Row Level Security (RLS) is enabled.

Policies ensure:

- Users can only view their own bookmarks
- Users can only insert their own bookmarks
- Users can only update their own bookmarks
- Users can only delete their own bookmarks

This ensures full data privacy.

---

## Real-time Functionality

Supabase realtime is enabled using publications.

Whenever a bookmark is:

- added
- edited
- deleted

It updates instantly without page refresh.

Even if opened in multiple tabs.

---

## Problems Faced and Solutions

### Problem 1: Google login redirect loop

Issue:
After clicking login, it redirected back to login page.

Cause:
Auth callback route was missing.

Solution:
Created auth callback route:

app/auth/callback/route.ts


Handled session correctly using Supabase server client.

---

### Problem 2: Logout not working properly

Issue:
After logout, user was still logged in.

Cause:
Session was not refreshed.

Solution:
Used:

await supabase.auth.signOut()
router.refresh()


This cleared session properly.

---

### Problem 3: Realtime updates not working

Issue:
Bookmarks only appeared after refresh.

Cause:
Supabase realtime was not enabled.

Solution:

Enabled realtime from Supabase dashboard:

Database → Publications → supabase_realtime → enable bookmarks table


And implemented realtime subscription in frontend.

---

### Problem 4: Edit bookmark not updating

Issue:
Bookmark edit UI worked but database did not update.

Cause:
Missing select().single() after update.

Solution:

.update({...})
.eq("id", editing.id)
.select()
.single()


This returned updated row and UI updated instantly.

---

### Problem 5: Delete confirmation and realtime delete

Issue:
Delete UI was not professional and realtime delete did not reflect instantly.

Solution:

- Created professional confirmation modal
- Implemented realtime DELETE event listener
- Updated state instantly

---

### Problem 6: UI was not professional

Issue:
UI looked very basic.

Solution:

Improved:

- Professional navbar
- Modern bookmark cards
- Modal edit form
- Delete confirmation modal
- Hover effects
- Responsive layout

---

## How to Run Locally

Clone repository:

git clone https://github.com/Abhishekguptaa4/smart-bookmark-app.git


Go into project:

cd smart-bookmark-app


Install dependencies:

npm install


Create environment file:

.env.local


Add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key


Run project:

npm run dev


Open:

http://localhost:3000


---

## Deployment

Project is deployed using Vercel.

Steps:

- Push code to GitHub
- Import repository in Vercel
- Add environment variables
- Deploy

---

## Author

Abhishek Gupta

B.Tech Student  
Full Stack Developer  