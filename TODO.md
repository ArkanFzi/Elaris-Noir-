# Admin Dashboard Development Plan

## Information Gathered
- Frontend is Next.js with TypeScript, using contexts for Auth, Cart, Wishlist, Search
- User pages include home (hero, featured products, ingredients, journal preview, spotlight, categories, testimonials), collection, journal, product details, account (dashboard, wishlist)
- Dynamic content includes products, articles, testimonials, user data, wishlist, cart
- Authentication system in place with AuthContext

## Plan
- Create admin layout with navigation and authentication check
- Build admin dashboard page with overview metrics
- Create product management page (CRUD for products)
- Create article management page (CRUD for journal articles)
- Create user management page (view users, manage accounts)
- Create testimonials management page
- Add admin routes to app structure
- Implement API integration for data management (assuming backend endpoints exist)
- Add admin access control

## Dependent Files to be edited
- fe/app/layout.tsx (add admin routes)
- fe/context/AuthContext.tsx (add admin role check)
- New admin pages and components

## Followup steps
- Test admin functionality
- Ensure data sync with user pages
- Add proper error handling and loading states
