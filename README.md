This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Folder and Files Structure

    Project/

├── README.md
├── app/
│ ├── page.tsx
│ └── page name/
│ └── page.tsx
├── public/
├── public/

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Register Page Refactoring Summary

## Overview

Successfully refactored the register page to use modular components with CSS modules, added particle animation effects, and enhanced responsive design for different screen sizes.

## Changes Made

### 1. Component Structure

The page has been split into the following functional components:

#### **AnimatedBackground Component** (`components/AnimatedBackground.tsx`)

- Handles all particle animation effects
- Creates 80 particles with random sizes and positions
- Implements mouse interaction that creates temporary particles at cursor position
- Moves gradient spheres based on mouse position
- Uses `useEffect` for lifecycle management and cleanup

#### **InputField Component** (`components/InputField.tsx`)

- Reusable input field with icon support
- Properly styled using CSS modules
- Supports different input types (email, password, text)

#### **RegisterForm Component** (`components/RegisterForm.tsx`)

- Contains all form logic and state management
- Email validation (checks if emails match)
- Integrates with Kinde Auth for Google authentication
- Contains all form fields, buttons, and action links

#### **ImageSection Component** (`components/ImageSection.tsx`)

- Displays the decorative image on the right side
- Responsive design with backdrop blur effect

### 2. CSS Modules Implementation

All CSS has been converted to CSS modules with proper naming conventions:

- `gradientBackground` → Used for the animated background container
- `gradientSphere`, `sphere1`, `sphere2`, `sphere3` → Animated gradient spheres
- `particlesContainer`, `particle` → Particle animation elements
- `formContainer`, `formContent`, `form` → Form layout
- `inputWrapper`, `inputIcon`, `input` → Input field styling
- `googleButton`, `signUpButton`, `loginButton` → Button styles
- And many more...

### 3. Responsive Design

Added comprehensive media queries for different screen sizes:

#### **Tablets and Small Desktops** (max-width: 1024px)

- Stacks form and image vertically
- Reduced gaps and padding
- Image section reduced to 400px height

#### **Mobile Devices** (max-width: 768px)

- Further reduced spacing
- Container width reduced to 95%
- Image section reduced to 300px height
- Gradient spheres enlarged for better visual effect

#### **Small Mobile Devices** (max-width: 480px)

- Minimal padding for maximum screen usage
- Smaller font sizes (0.8125rem)
- Image section reduced to 250px height
- Ultra-compact button padding

#### **Large Screens** (min-width: 1280px)

- Form takes 30% width
- Image section takes 70% width
- Larger gap (3rem) between sections

### 4. Particle Animation Features

The particle animation system includes:

- **Static Particles**: 80 particles that float randomly across the screen
- **Mouse-Triggered Particles**: Created when the user moves the mouse
- **Random Properties**: Each particle has random size, duration, and movement
- **Smooth Animations**: Uses CSS transitions for smooth movement
- **Gradient Sphere Interaction**: Spheres subtly follow mouse movement

### 5. File Structure

```
src/app/auth/register/
├── components/
│   ├── AnimatedBackground.tsx
│   ├── InputField.tsx
│   ├── RegisterForm.tsx
│   ├── ImageSection.tsx
│   └── index.ts
├── page.tsx
└── animation.module.css
```

### 6. Main Page Simplification

The main `page.tsx` is now extremely clean and simple:

```tsx
export default function RegisterPage() {
  return (
    <div className={styles.pageContainer}>
      <AnimatedBackground />
      <div className={styles.contentContainer}>
        <RegisterForm />
        <ImageSection />
      </div>
    </div>
  );
}
```

## Benefits

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other pages
3. **Maintainability**: Easier to locate and fix bugs
4. **Performance**: Better code splitting and lazy loading potential
5. **Responsive**: Works seamlessly on all device sizes
6. **Interactive**: Engaging particle animations enhance user experience
7. **Type Safety**: Full TypeScript support with proper typing

## Testing Recommendations

1. Test on different screen sizes (mobile, tablet, desktop)
2. Verify particle animations work smoothly
3. Test form validation (email matching)
4. Verify Google authentication flow
5. Check accessibility features
6. Test mouse interaction with particles and gradient spheres

## Future Enhancements

1. Add form validation error messages
2. Implement password strength indicator
3. Add loading states during authentication
4. Implement toast notifications for success/error states
5. Add accessibility improvements (ARIA labels)
6. Consider adding animation performance optimizations
