# Elaris Noir 🌑✨

**Elaris Noir** is a modern, ultra-luxury e-commerce frontend interface designed for a high-end perfume brand. It features a dark, elegant aesthetic with immersive storytelling elements, smooth micro-interactions, and a fully responsive layout.

## ✨ Key Features

- **Immersive Storytelling**: Editorial-style "Spotlight" and "Ingredients" sections.
- **Micro-interactions**: Smooth hover effects, parallax scrolling, and page transitions using [Framer Motion](https://www.framer.com/motion/).
- **E-commerce Functionality**:
  - Shopping Cart with drawer overlay and emptiness states.
  - Wishlist management with persistence.
  - Product filtering and sorting.
- **Responsive Design**: Mobile-first approach ensuring a premium experience on all devices.
- **Design System**: Custom typography (Playfair Display & Lato) and a curated Dark Blue & Gold color palette.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository (or download the source):

   ```bash
   git clone https://github.com/yourusername/elaris-noir.git
   cd elaris-noir/fe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the site.

## 📂 Project Structure

```bash
fe/
├── app/
│   ├── account/       # User account pages (Wishlist, Login)
│   ├── checkout/      # Checkout flow
│   ├── components/    # UI Components
│   │   ├── home/      # Homepage-specific components (Spotlight, Hero)
│   │   └── ui/        # Reusable primitives (Buttons, Modal)
│   ├── context/       # Global state (CartContext, WishlistContext)
│   ├── globals.css    # Global styles & Tailwind Theme
│   └── page.tsx       # Main Homepage
├── public/            # Static assets
└── ...
```

## 🎨 Design Philosophy

The design is grounded in "Digital Luxury"—minimalism combined with rich textures and deliberate motion.

- **Colors**: Deep Midnight Blue (`#0B1221`) and Brushed Gold (`#D4AF37`).
- **Typography**: `Playfair Display` for elegance, `Lato` for readability.
