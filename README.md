# Elaris Noir 🌑✨

<div align="center">

![Elaris Noir Banner](fe/.gemini/antigravity/brain/c89023eb-44bc-4761-9071-94b96668d1e0/hero_section_video_1766542086470.png)

**A Premium Luxury Perfume E-Commerce Experience**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 About The Project

**Elaris Noir** is a cutting-edge, ultra-luxury e-commerce frontend designed for a high-end perfume brand. It combines immersive storytelling, cinematic visuals, and smooth micro-interactions to create an unforgettable digital experience that mirrors the elegance and sophistication of luxury fragrances.

### 🎯 Design Philosophy

The design is grounded in **"Digital Luxury"** — a harmonious blend of minimalism, rich textures, and deliberate motion that creates a premium, state-of-the-art user experience.

- **Visual Identity**: Deep Midnight Blue (`#0B1221`) paired with Brushed Gold (`#D4AF37`)
- **Typography**: Playfair Display (serif) for elegance, Lato (sans-serif) for readability
- **Motion**: Purposeful animations that enhance rather than distract
- **Responsive**: Mobile-first approach ensuring premium experience on all devices

---

## ✨ Key Features

### 🎬 Immersive Visual Experience

- **Cinematic Hero Video Background**: Full-screen HD video with smooth fade-in transitions and elegant fallback
- **Parallax Scrolling Effects**: Multi-layer parallax on story pages for depth and engagement
- **Scroll-Triggered Animations**: Fade-in and slide-up animations as users explore content
- **Visual Dividers**: Animated gold dividers between sections for a curated journey

### 🛍️ E-Commerce Functionality

- **Smart Product Filtering**: Real-time filtering by category (Eau de Parfum, Eau de Toilette, etc.)
- **Advanced Sorting**: Sort by price, name, or newest arrivals
- **Shopping Cart System**:
  - Slide-out cart drawer with smooth animations
  - Quantity management (increase/decrease)
  - Real-time price calculations
  - Empty state with elegant messaging
- **Wishlist Management**:
  - Add/remove favorites with heart icon
  - Persistent storage across sessions
  - Dedicated wishlist page
- **Quick View Modal**: Preview product details without leaving the current page

### 🔍 Smart Search

- **Live Search Overlay**: Full-screen search with instant results
- **Multi-Category Results**: Search across products, stories, and journal entries
- **Keyboard Navigation**: ESC to close, smooth focus management
- **Debounced Input**: Optimized performance with smart search delays

### 🎨 Interactive Components

- **Scent Finder Quiz**:
  - Personalized fragrance recommendations
  - 8 atmospheric questions
  - Beautiful results page with product suggestions
- **Ingredient Showcase**:
  - Hover effects revealing ingredient details
  - Premium card animations
  - Educational content about rare ingredients
- **Product Spotlight**: Featured scent with immersive imagery and storytelling
- **Customer Testimonials**: Rotating reviews with elegant typography

### 📱 Responsive Design

- **Mobile-First Approach**: Optimized for smartphones, tablets, and desktops
- **Adaptive Navigation**: Hamburger menu on mobile, full navbar on desktop
- **Touch-Optimized**: Smooth gestures and interactions on touch devices
- **Flexible Layouts**: Grid systems that adapt to any screen size

### 🎭 Premium UI/UX

- **Micro-Interactions**:
  - Button hover effects with scale and glow
  - Card zoom on hover
  - Smooth page transitions
- **Newsletter Popup**: Elegant modal for email collection ("The Inner Circle")
- **Empty States**: Thoughtfully designed empty cart and wishlist states
- **Loading States**: Skeleton screens and smooth content loading
- **Error Handling**: Graceful fallbacks for images and videos

### 📚 Content-Rich Pages

- **Homepage**:
  - Hero section with video
  - Spotlight feature
  - Featured scents grid
  - Rare ingredients showcase
  - Brand story teaser
  - Testimonials carousel
  - Journal preview
- **Collection Page**: Full product catalog with filters and sorting
- **Product Detail Page**:
  - Olfactory pyramid visualization
  - Detailed descriptions
  - Customer reviews
  - Related products
- **Our Story Page**:
  - Brand heritage narrative
  - Parallax scrolling chapters
  - Video backgrounds
  - Sticky chapter navigation
- **Scent Quiz Page**: Interactive personality-based fragrance finder
- **Journal/Blog**: Editorial content about perfumery

---

## 🛠️ Tech Stack

### Core Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 18](https://react.dev/)** - UI library with hooks and context

### Styling & Animation

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **Custom CSS** - Gradient animations and advanced effects

### UI Components & Icons

- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icon set
- **Custom Components** - Reusable UI primitives (Button, Modal, etc.)

### State Management

- **React Context API** - Global state for cart, wishlist, and search
- **Local Storage** - Persistent data across sessions

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArkanFzi/Elaris-Noir.git
   cd Elaris-Noir/fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
Elaris-Noir/
├── fe/                          # Frontend application
│   ├── app/                     # Next.js App Router
│   │   ├── account/            # User account pages
│   │   │   ├── login/          # Login page
│   │   │   └── wishlist/       # Wishlist page
│   │   ├── checkout/           # Checkout flow
│   │   ├── collection/         # Product collection page
│   │   ├── components/         # React components
│   │   │   ├── home/          # Homepage components
│   │   │   │   ├── Hero.tsx           # Video hero section
│   │   │   │   ├── Spotlight.tsx      # Featured product
│   │   │   │   ├── Featured.tsx       # Product grid
│   │   │   │   ├── Ingredients.tsx    # Ingredient showcase
│   │   │   │   ├── Testimonials.tsx   # Customer reviews
│   │   │   │   └── JournalPreview.tsx # Blog preview
│   │   │   ├── ui/            # Reusable UI components
│   │   │   │   ├── Button.tsx         # Button component
│   │   │   │   └── Modal.tsx          # Modal component
│   │   │   ├── CartDrawer.tsx         # Shopping cart
│   │   │   ├── Footer.tsx             # Site footer
│   │   │   ├── Navbar.tsx             # Navigation bar
│   │   │   ├── NewsletterPopup.tsx    # Email signup
│   │   │   ├── QuickViewModal.tsx     # Product preview
│   │   │   └── SearchOverlay.tsx      # Search interface
│   │   ├── context/            # React Context providers
│   │   │   ├── CartContext.tsx        # Cart state
│   │   │   ├── WishlistContext.tsx    # Wishlist state
│   │   │   └── SearchContext.tsx      # Search state
│   │   ├── our-story/          # Brand story page
│   │   ├── product/            # Product detail pages
│   │   ├── quiz/               # Scent finder quiz
│   │   ├── globals.css         # Global styles & theme
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Homepage
│   ├── public/                 # Static assets
│   │   ├── HeroVideo.mp4      # Hero background video
│   │   └── ...                # Images and other assets
│   ├── package.json           # Dependencies
│   ├── tailwind.config.ts     # Tailwind configuration
│   └── tsconfig.json          # TypeScript configuration
└── README.md                  # This file
```

---

## 🎥 Demo Video

Watch the full website walkthrough showcasing all features:

![Elaris Noir Demo](fe/.gemini/antigravity/brain/c89023eb-44bc-4761-9071-94b96668d1e0/elaris_noir_demo_1766543835660.webp)

_The demo includes: Hero video, product browsing, filtering, search, cart management, quiz interaction, and parallax scrolling._

---

## 🎨 Design Highlights

### Color Palette

```css
--midnight: #0b1221; /* Primary background */
--gold: #d4af37; /* Accent color */
--mist: #f5f5f5; /* Primary text */
--slate: #94a3b8; /* Secondary text */
```

### Typography

- **Headings**: Playfair Display (Serif) - Elegant and timeless
- **Body**: Lato (Sans-serif) - Clean and readable

### Animations

- **Fade In**: Smooth opacity transitions on scroll
- **Slide Up**: Content reveals from below
- **Scale**: Subtle zoom effects on hover
- **Gradient Shift**: Animated background gradients

---

## 🔮 Future Enhancements

### Backend Integration

- [ ] User authentication (login/signup)
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Order management system
- [ ] Admin dashboard

### Additional Features

- [ ] Product reviews and ratings
- [ ] Social media integration
- [ ] Multi-language support (i18n)
- [ ] Currency converter
- [ ] Gift wrapping options
- [ ] Subscription service (monthly fragrance box)
- [ ] AR try-on feature
- [ ] Scent profile builder

### Performance Optimization

- [ ] Image optimization with Next.js Image
- [ ] Code splitting and lazy loading
- [ ] CDN integration
- [ ] Service worker for offline support
- [ ] Performance monitoring

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Arkan Fauzi** - [@ArkanFzi](https://github.com/ArkanFzi)

Project Link: [https://github.com/ArkanFzi/Elaris-Noir](https://github.com/ArkanFzi/Elaris-Noir)

---

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) - Stock imagery
- [Google Fonts](https://fonts.google.com/) - Typography

---

<div align="center">

**Made by Arkan Fauzi**

⭐ Star this repo if you find it helpful!

</div>
