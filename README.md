# 🎓 Digital Yearbook (Batch 2023-26)

A fully responsive, interactive, and beautifully designed digital yearbook application for the Batch of 2023-26. Built with a playful, handwritten doodle theme, this platform immortalizes student and staff memories, offering interactive profiles, a media flashback gallery, and a message wall.

## 🌟 Overview

The Digital Yearbook is designed to be a digital repository of memories. Unlike a traditional printed yearbook, this interactive application brings memories to life with smooth animations, dynamic content, and an engaging doodle-style aesthetic.

## 🚀 Features

- **🎓 Interactive Profiles:** Dedicated cards and detailed profile pages for both students and staff, complete with photos, roles, quotes, and social links.
- **🎨 Playful Design:** A unique, custom handwritten doodle theme that gives the app a nostalgic, personalized feel.
- **📸 Memories Flashback:** A dedicated media viewer for exploring photos and videos of events, trips, and candid moments.
- **📝 Message Wall:** A dynamic, interactive wall where users can leave messages, doodles, and memories for their peers.
- **✨ Smooth Animations:** Powered by Framer Motion, every interaction—from page transitions to card hovers—feels fluid and alive.
- **🔒 Secure Authentication:** JWT-based login system for profile editing and administrative actions.

## 💻 Technologies Used

### Frontend
- **React 19** (via Vite)
- **React Router v7** for seamless navigation and route-level code-splitting
- **Framer Motion** for complex, fluid UI animations
- **React Hot Toast** for beautiful user notifications
- **Vanilla CSS** for the custom doodle aesthetic, responsive grids, and layouts

### Backend
- **Node.js & Express.js** for robust API routing
- **MongoDB & Mongoose** for flexible data modeling (Students, Staff, Messages, Media)
- **JWT (JSON Web Tokens)** for secure authentication
- **Helmet & CORS** for API security and cross-origin resource sharing

## 🛠️ The Process (How I Built It)

1. **Planning & Design:** I started with a vision of a nostalgic, doodle-styled yearbook. The goal was to make it feel less like a corporate application and more like a high school notebook.
2. **Backend Architecture:** I set up an Express/Node.js server with MongoDB, designing schemas for users (students and staff), memories (photos/videos), and the message wall.
3. **Frontend Foundations:** Using Vite and React, I built out the component structure, ensuring that route-level lazy loading was in place from the beginning to optimize performance.
4. **Theming & Animations:** A significant amount of time was spent perfecting the CSS for the handwritten theme and using Framer Motion to make cards, profile modals, and media galleries pop into place naturally.
5. **AI Assistance:** During the process, I also received help from Claude, Antigravity, and Stitch to make the UI structure better and refine the user experience.

## 🧠 What I Learned

- **Advanced React Patterns:** Implementing route-level code splitting (`lazy` and `Suspense`) to keep the initial bundle size small.
- **Complex Animations:** Mastering Framer Motion to create a UI that feels responsive, organic, and physically grounded.
- **Full-Stack Integration:** Connecting a secure Express backend with a modern React frontend, managing complex states, and designing a cohesive MERN stack architecture.

## 🔗 Preview
**[Live Preview](https://batch2023-2026.vercel.app/)**
