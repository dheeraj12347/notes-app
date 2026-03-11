

# 📝 Notes App

A simple, responsive, and robust Notes application built with **Svelte** and **TailwindCSS**. It interacts with a MockAPI to manage notes.

## 🔗 Links
- **GitHub Repo:** [https://github.com/dheeraj12347](https://github.com/dheeraj12347)
- **Deployed App:** [Paste your new Vercel URL right here]

## ✨ Features
- **CRUD Operations**: Create, Read, Update, and Delete notes.
- **Search & Sort**: Debounced search and sorting by ID, Title, and Creation Date.
- **Pagination**: View 20 notes per page.
- **Dark Mode**: Fully supported dark mode toggle using Tailwind.
- **Offline Sync**: Operations are queued when offline and flushed once connectivity is restored. UI indicators show sync status.
- **Keyboard Shortcuts**: `Ctrl+N` to focus inputs, `Esc` to close modals.
- **Soft Delete**: Deleting a note gives a 10s toast window to Undo.
- **Optimistic UI & Loading States**: Skeleton loaders, button spinners, and optimistic updates.

### 🎨 Custom Feature Added: Dynamic Theming Engine
The rubric requested adding a custom feature. I built a **Dynamic CSS Theming Engine**. Next to the Dark Mode toggle, there is a palette selector that lets users instantly swap the primary accent color of the entire application globally (e.g. Blue, Emerald, Rose, Amber).
* **Why I chose it:** It demonstrates advanced understanding of Tailwind v4 and CSS variables. By mapping `--color-primary` CSS tokens to physical Tailwind utility classes, the app can instantly repaint hundreds of elements (buttons, links, badges, hover actions) without relying on messy JS DOM re-renders. It combines visual creativity with architectural efficiency.

## 🚀 How to Run & Deploy

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the root directory and add your MockAPI URL:
   ```
   VITE_API_URL=https://[mockapi-id].mockapi.io/notes
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Build for production:
   ```sh
   npm run build
   ```

## 🧠 Reflection & Approach
My approach was to initially set up a solid UI foundation using Svelte and Tailwind, ensuring responsiveness and standard features like Dark Mode. Then I integrated the MockAPI wrapper with support for sorting, searching, and pagination built natively into the fetch requests.
The hardest part was implementing the Offline Sync system. I decided to queue CRUD actions in `localStorage` when `navigator.onLine` is false and replay them to the API when connectivity returns.

### Added Dependencies & Trade-offs
- No extra dependencies outside basic Svelte and Tailwind.
- Using `localStorage` for offline queueing is simple but limit testing on MockAPI meant I had to ensure optimistic IDs (like `temp-[uuid]`) don't break subsequent updates before they are fully synced.

### What I'd do with more time
- Add heavier End-to-End testing via Playwright.
- Connect to a more robust backend (PostgreSQL/Supabase) to support multi-user authentication.
- Implement Drag & Drop for manual note sorting.
