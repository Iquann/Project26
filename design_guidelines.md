# Design Guidelines: Timber Taylor Doodles Clone

## Design Approach
**Reference-Based:** Inspired by the original Timber Taylor Doodles site and similar pet breeder websites (e.g., PuppySpot, GoodDog). Warm, family-friendly aesthetic that emphasizes trust, transparency, and the adorable nature of puppies.

## Core Design Principles
- **Approachable & Trustworthy:** Family business feel with personal touches
- **Puppy-First:** Let images of puppies drive emotional connection
- **Clear & Transparent:** Pricing, processes, and guarantees are easy to find
- **Professional Yet Warm:** Not corporate, but credible and organized

## Typography
- **Primary Font:** Montserrat (Google Fonts) - clean, modern, friendly
- **Secondary Font:** Open Sans (Google Fonts) - readable for body text
- **Hierarchy:**
  - H1: 2.5rem (40px) / font-semibold
  - H2: 2rem (32px) / font-semibold  
  - H3: 1.5rem (24px) / font-medium
  - Body: 1rem (16px) / font-normal
  - Small text: 0.875rem (14px)

## Layout System
**Spacing Units:** Use Tailwind spacing of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 to py-24
- Component spacing: gap-8 to gap-12
- Container: max-w-7xl mx-auto px-4

## Page-Specific Layouts

### Homepage
- Hero section (70vh) with large puppy image, business name, and tagline
- About Us section with owner photos (2-column: image + text)
- Goldendoodles section (image left, content right)
- Bernedoodles section (image right, content left)
- Health Guarantee callout with badge/seal visual
- Mailing list signup
- Contact footer

### Pricing Page
- Hero: Simple header with title
- Pricing tables (2-column grid: Goldendoodles | Bernedoodles)
- Deposit information with $500 highlighted
- **Payment Methods Section:** Grid of payment options with icons
  - PayPal, Cash App, Zelle, Apple Pay cards
  - Crypto payment card with "10% OFF - Pay $450" badge
- Spay/Neuter contract info
- Process timeline (numbered steps)
- Transport/boarding info
- What's included list

### Puppy Listings
- Filter bar (breed, availability)
- Grid layout (3 columns on desktop, 2 on tablet, 1 on mobile)
- Puppy cards: large image, name, breed, price, status badge

### Schedule/Upcoming Litters
- Timeline view of upcoming litters
- Deposit button per litter
- Expected dates, breed info

## Component Library

### Cards
- Rounded corners (rounded-lg)
- Subtle shadow (shadow-md)
- White background with hover lift effect
- Padding: p-6

### Buttons
- Primary: Full, rounded, medium padding (px-8 py-3)
- Secondary: Outlined style
- Deposit buttons: Prominent, larger size
- Payment method buttons: Icon + label, grid layout

### Payment Method Selector
- Card-based layout with icons
- Clear pricing display per method
- Crypto option with green "10% OFF" badge
- 3% fee notation for PayPal/credit cards

### Forms
- Mailing list: Checkboxes for breed preferences + email input
- Contact forms: Clean, single column
- Rounded inputs with clear labels

### Navigation
- Sticky header with logo, nav links, phone number
- Mobile: Hamburger menu
- Desktop: Horizontal navigation

### Footer
- 3-column layout: Contact info, Quick links, Social/Mailing list
- Copyright and credits

## Images

**Large Hero Images:**
- Homepage: Adorable puppy (Goldendoodle or Bernedoodle) in natural setting, 1920x800px
- Owners section: Professional but friendly photo of Ashlie and Jessi with puppies

**Section Images:**
- Goldendoodle feature: Red mini goldendoodle puppy, close-up
- Bernedoodle feature: Tri-color bernedoodle puppy
- Health guarantee: Seal/badge graphic or puppy with vet
- Pricing page header: Puppy playing or group of puppies

**Puppy Listings:**
- Individual puppy photos: 600x600px, high quality
- Multiple angles per puppy if available

**General Guidelines:**
- All images should be warm, bright, high-quality
- Prefer natural lighting and home settings
- Show puppies being playful, cute, approachable

## Visual Enhancements
- Subtle gradient overlays on hero images for text readability
- Icons for payment methods (use Font Awesome)
- Badge/seal graphic for 2-year health guarantee
- "Special Offer" badge for crypto discount
- Testimonial cards if space allows

## Responsive Behavior
- Mobile-first approach
- Stack columns on mobile
- Collapsible navigation
- Touch-friendly button sizes (minimum 44px height)
- Payment method grid: 2 columns mobile, 4 columns desktop