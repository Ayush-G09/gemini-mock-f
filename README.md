
# 🌌 Gemini Mock Frontend Clone

A polished and functional frontend clone of Gemini with advanced chat interface behaviors such as infinite scroll, image upload, typing indication, toast notifications, throttling, and form validation.

---

## 🚀 Live Demo

🔗 [View Live App on Vercel](https://gemini-mock-f.vercel.app/app)  
🧪 **Mock OTP for Login**: `111111`

---

## 📁 Repository

📦 [GitHub Repository](https://github.com/Ayush-G09/gemini-mock-f)

---

## 🛠️ Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Ayush-G09/gemini-mock-f.git
cd gemini-mock-f
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm start
```

### 4. Build for Production

```bash
npm run build
```

---

---

## ✅ Key Features & Implementations

### 🔁 Infinite Scroll
- Implemented using a custom `useInfiniteScroll` hook.
- Automatically loads older messages on scroll.

### ⚙️ Throttling
- Input fields like search and typing are throttled using a custom `useThrottle` hook.
- Optimizes performance and reduces API load.

### 📤 Image Upload
- Allows users to upload and send images.
- Previews the image before sending.

### ✍️ Typing Indicator
- Displays a dynamic “Typing…” animation when a user is composing a message.

### 🧪 Form Validation
- Built with `react-hook-form`.
- Validates inputs such as email, OTP, and message content.

### 📦 Pagination
- Server-side pagination for chat messages.
- Triggered through infinite scroll for scalability.

### 🔔 Toast Notifications
- Real-time feedback using toast popups for actions like:
  - Message sent
  - Image uploaded
  - Validation errors

### 📱 Responsive & Accessible
- Fully responsive across all device types.
- Built with accessibility in mind for better user experience.

---

## 📸 Screenshots *(Optional)*

_Add UI/UX screenshots here to visually showcase the project._

---

## 👨‍💻 Tech Stack

- **React** + **TypeScript**
- **React Router**
- **React Hook Form**
- **Custom Hooks** (e.g., Throttle, Infinite Scroll)
- **CSS Modules / TailwindCSS** *(if applicable)*
- **Vercel** for deployment

---

## 📨 Submission Details

- Submitted for the **Kuvaka Tech Gemini Frontend Clone Assignment**.
- **Mock OTP for Login**: `111111`

---

Feel free to ⭐ the repo if you found it helpful!
