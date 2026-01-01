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

## 📊 Project Status

### Phase 1: Backend APIs & Database ✅ COMPLETE

- ✅ **Authentication System**: JWT-based auth with role-based access control (Admin/Customer)
- ✅ **User Management**: Registration, login, profile updates, role promotion
- ✅ **Products API**: Full CRUD operations with admin controls
- ✅ **Articles API**: CRUD with status management (draft/published)
- ✅ **Testimonials API**: CRUD with ratings and approval workflow
- ✅ **Wishlist API**: GET, POST, DELETE operations
- ✅ **Orders API**: Create and retrieve order history
- ✅ **Admin Dashboard Stats**: Real-time metrics (users, products, revenue, growth)
- ✅ **Database Schema**: PostgreSQL with 9 tables and proper constraints
- ✅ **CORS Configuration**: Secure cross-origin resource sharing
- ✅ **Middleware**: Authentication and admin authorization guards

### Phase 2A: Admin Dashboard & Management ✅ COMPLETE

- ✅ **Admin Layout**: Elegant sidebar navigation with role-based routing
- ✅ **Dashboard Overview**:
  - Real-time statistics cards (Users, Products, Revenue, Growth Rate)
  - Recent activity feed
  - Quick action buttons
  - Glassmorphism design with gradient effects
- ✅ **Products Management**:
  - Full CRUD interface with modal dialogs
  - Image upload support
  - Search and filter functionality
  - Grid view with product cards
- ✅ **Articles Management**:
  - Create/Edit/Delete articles
  - Status management (draft/published)
  - Rich content editor
- ✅ **Testimonials Management**:
  - CRUD operations
  - Rating system (1-5 stars)
  - Approval workflow
- ✅ **Users Management**:
  - View all registered users
  - User role display (Admin/Customer)
  - Delete user functionality
  - Search by name/email
  - Registration date tracking

### Phase 2B: Authentication & User Experience ✅ COMPLETE

- ✅ **Login System**:
  - JWT token-based authentication
  - Automatic admin redirect to `/admin` dashboard
  - Customer redirect to homepage
  - Animated glassmorphism form design
  - Loading states with bouncing dots animation
- ✅ **Registration System**:
  - User account creation
  - Form validation (password confirmation)
  - Elegant animated UI with gradient effects
  - Auto-login after successful registration
- ✅ **Protected Routes**:
  - Frontend route guards for admin pages
  - Backend middleware for API security
  - Role-based access control
- ✅ **Dynamic Navbar**:
  - Shows Login/Register for guests
  - Shows Profile/Logout for authenticated users
  - Role-based profile link (Admin → `/admin`, Customer → `/account`)
  - User avatar with initials

### Phase 2C: UI/UX Enhancements ✅ COMPLETE

- ✅ **Animated Forms**:
  - Glassmorphism effect with backdrop blur
  - Smooth fade-in and slide-up animations
  - Decorative gradient blobs with hover effects
  - Input focus animations (label color change, border glow)
  - Premium gradient buttons with scale and shadow effects
- ✅ **Admin Dashboard Polish**:
  - Gradient stat cards with hover animations
  - Improved typography and spacing
  - Icon integration for visual clarity
  - Responsive grid layouts

### Phase 3: Public Features ⏳ IN PROGRESS

- ⏳ Dynamic product fetching from backend
- ⏳ Product detail page backend integration
- ⏳ Collection page dynamic data
- ⏳ User profile management UI
- ⏳ Order history page
- ⏳ Checkout flow completion

### Documentation 📚 COMPLETE

- ✅ [ADMIN_QUICK_START.md](ADMIN_QUICK_START.md) - User-friendly admin guide
- ✅ [ADMIN_COMPONENTS.md](ADMIN_COMPONENTS.md) - Technical component documentation
- ✅ [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Full system overview
- ✅ [PHASE_2A_SUMMARY.md](PHASE_2A_SUMMARY.md) - Implementation details
- ✅ [PROJECT_STATUS.md](PROJECT_STATUS.md) - Feature roadmap & architecture
- ✅ [PHASE_2A_COMPLETION_REPORT.md](PHASE_2A_COMPLETION_REPORT.md) - Executive summary

---

## ✨ Key Features

### 🔐 Authentication & Security

- **JWT-Based Authentication**: Secure token-based login system
- **Role-Based Access Control**: Separate admin and customer roles
- **Protected Routes**: Frontend and backend route guards
- **Auto-Redirect**: Admins automatically directed to dashboard
- **Session Persistence**: Login state maintained across browser sessions
- **Secure Password Storage**: Bcrypt hashing for user credentials

### 👨‍💼 Admin Dashboard

- **Real-Time Statistics**:
  - Total users count
  - Product inventory tracking
  - Monthly revenue calculations
  - Growth rate metrics
- **User Management**:
  - View all registered users
  - Search by name or email
  - Delete user accounts
  - Role identification (Admin/Customer)
- **Product Management**:
  - Create, edit, and delete products
  - Image URL management
  - Price in cents for accuracy
  - Category organization
- **Content Management**:
  - Articles CRUD (blog posts)
  - Testimonials approval system
  - Status management (draft/published)
- **Elegant UI**:
  - Glassmorphism design
  - Gradient stat cards with hover effects
  - Responsive sidebar navigation
  - Quick action buttons

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

### Frontend Technologies

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 18](https://react.dev/)** - UI library with hooks and context

### Backend Technologies

- **[Go](https://go.dev/)** - High-performance backend language
- **[Gorilla Mux](https://github.com/gorilla/mux)** - HTTP router and URL matcher
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[JWT](https://github.com/golang-jwt/jwt)** - JSON Web Token authentication
- **[Bcrypt](https://pkg.go.dev/golang.org/x/crypto/bcrypt)** - Password hashing
- **[godotenv](https://github.com/joho/godotenv)** - Environment variable management

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
- **Go** v1.21 or higher
- **PostgreSQL** v14 or higher

### Frontend Setup

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

3. **Configure environment variables**

   Create a `.env.local` file in the `fe` directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd ../be
   ```

2. **Configure environment variables**

   Create a `.env` file in the `be` directory:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=elaris_noir
   SSL_MODE=disable
   ALLOWED_ORIGINS=*
   ```

3. **Install Go dependencies**

   ```bash
   go mod download
   ```

4. **Run the backend server**

   ```bash
   go run cmd/api/main.go
   ```

   The server will start on `http://localhost:8080`

5. **Create an admin user** (Optional)

   ```bash
   go run cmd/promote_admin/main.go your-email@example.com
   ```

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

- [x] User authentication (login/signup) ✅
- [x] Database integration (PostgreSQL) ✅
- [x] Admin dashboard ✅
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Order management system (tracking, status updates)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Inventory management with low stock alerts

### Additional Features

- [ ] Product reviews and ratings system
- [ ] Social media integration (share products)
- [ ] Multi-language support (i18n)
- [ ] Currency converter
- [ ] Gift wrapping options
- [ ] Subscription service (monthly fragrance box)
- [ ] AR try-on feature
- [ ] Scent profile builder
- [ ] Loyalty program and rewards
- [ ] Advanced analytics dashboard
- [ ] Customer support chat integration

### Performance Optimization

- [ ] Image optimization with Next.js Image
- [ ] Code splitting and lazy loading
- [ ] CDN integration
- [ ] Service worker for offline support
- [ ] Performance monitoring (Lighthouse scores)
- [ ] Database query optimization
- [ ] Redis caching layer

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
