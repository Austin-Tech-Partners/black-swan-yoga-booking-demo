# Black Swan Yoga Booking Flow

A mobile-first booking application for Black Swan Yoga studios, designed to provide a seamless and frictionless experience for customers looking to book yoga classes.

## Project Overview

This is a frontend-only MVP that implements a streamlined booking flow for Black Swan Yoga studios. The application focuses on providing an intuitive mobile experience while maintaining all essential booking functionality. The goal is to showcase modern UX/UI and forward-thinking design for a yoga studio booking process.

## Business & UX Context

- **Current Pain Points:**
  - The existing booking process is cumbersome, with too many clicks, long forms, and a poor mobile experience.
  - This project aims to demonstrate a vastly improved, user-centric flow.
- **Target User:**
  - Focused on new customers and first-time visitors.
  - Prompts for sign-in at key stages (initial and info capture) to encourage account creation for faster future bookings.
- **Business Logic:**
  - No real backend or business rules for this MVP; all data is mocked.
  - The goal is to demonstrate skillset and design thinking, not to implement production logic.

## Core Features

### Location-Based Studio Selection
- Automatically detects user's location and suggests the nearest studio.
- All studios are listed for manual selection.
- Studio selection does not affect available classes or instructors in this MVP (mocked backend).

#### Studio List
- **Austin:** Anderson, Cedar Park, Cesar Chavez, Orchard, Round Rock, Westgate
- **Dallas:** Bishop, Lovers, Skillman
- **Denver:** Capitol Hill, South Broadway
- **Houston:** Fannin, Kirby, White Oak
- **Phoenix:** Midtown, Old Town, Paradise Valley
- **San Antonio:** Downtown, Vineyard

### Class Schedule & Filtering
- Displays upcoming class schedule (mocked data)
- Intuitive date selection interface
- Filter options for:
  - Class types
  - Instructors
  - Time slots

### Booking Flow
1. Class selection
2. Booking review
3. Account creation (if new user)
   - Name
   - Email
   - Phone number
   - Prompts for sign-in at key stages
4. Donation selection
   - Minimum: $12
   - Suggested: $20 (highlighted)
   - Custom amount option
   - Option to purchase membership ($88/month, unlimited classes)
5. Payment processing (mocked)
   - Secure checkout experience
   - Credit card information collection

## Technical Stack

- Built with SvelteKit
- Mobile-first design approach
- Mocked backend services for MVP phase
- Focus on visual polish and best-in-class UX
- Configured for AWS Amplify deployment with SSR support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

### AWS Amplify Deployment

This project is configured for AWS Amplify hosting with server-side rendering (SSR) support. The deployment uses the Node.js adapter and includes all necessary configuration files.

#### Quick Deploy

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Create Amplify App**: 
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "Create new app" > "Host web app"
   - Connect your GitHub repository
3. **Configure Build Settings**: The `amplify.yml` file is already configured with the correct build commands
4. **Deploy**: Amplify will automatically build and deploy your application

#### Build Configuration

The project includes:
- `amplify.yml` - Build configuration for AWS Amplify
- `amplify.mjs` - Custom build script for SSR deployment structure
- `@sveltejs/adapter-node` - Node.js adapter for SvelteKit SSR

#### Environment Variables

If you need to set environment variables:
1. In the Amplify Console, go to your app
2. Navigate to "App settings" > "Environment variables"
3. Add any required environment variables
4. Redeploy the application

#### Manual Build Test

To test the build process locally:

```bash
# Build the application
npm run build

# Run the Amplify build script
node amplify.mjs

# Check the generated .amplify-hosting directory
ls -la .amplify-hosting
```

The build process creates a `.amplify-hosting` directory with the proper structure for Amplify's SSR hosting, including static assets and compute resources.

## Project Status

This is an MVP version focusing on the core booking flow. Backend integration and studio-specific features may be implemented in future iterations.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Access the application at `localhost:5173` (or the port shown in your terminal)
