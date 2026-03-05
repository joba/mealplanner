# Menu Planner

A modern meal planning application built with Next.js that helps you organize weekly meals, manage meal plans, and integrate school lunch information.

## Features

- **Weekly Meal Calendar**: Visual week-based meal planning interface
- **Meal Management**: Create, read, update, and delete meals with comprehensive meal details
- **Meal Plans**: Organize meals into weekly plans with easy-to-use planning interface
- **School Lunch Integration**: Automatically scrape and display school lunch menus
- **Responsive Design**: Mobile-friendly interface with component-based architecture

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 14+ with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Styling**: Tailwind CSS with PostCSS
- **Database**: [Drizzle ORM](https://orm.drizzle.team) for type-safe database operations
- **API**: RESTful endpoints with Next.js Route Handlers

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── meals/        # Meal endpoints
│   │   ├── plan/         # Meal plan endpoints
│   │   └── school-lunch/ # School lunch endpoints
│   ├── meals/            # Meals page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── DayCard.tsx      # Individual day display
│   ├── MealPicker.tsx   # Meal selection UI
│   └── WeekCalendar.tsx # Weekly calendar view
└── lib/                 # Utility functions
    ├── db.ts           # Database client
    ├── scraper.ts      # Web scraping utilities
    └── week.ts         # Week helper functions

drizzle/
└── schema.ts           # Database schema definitions
```

## API Endpoints

- **GET /api/meals** - Retrieve all meals
- **POST /api/meals** - Create a new meal
- **GET /api/meals/[id]** - Get specific meal details
- **PUT /api/meals/[id]** - Update a meal
- **DELETE /api/meals/[id]** - Delete a meal

- **GET /api/plan** - Retrieve meal plans
- **POST /api/plan** - Create a new meal plan
- **GET /api/plan/[id]** - Get specific plan details
- **PUT /api/plan/[id]** - Update a meal plan
- **DELETE /api/plan/[id]** - Delete a meal plan

- **GET /api/school-lunch** - Fetch school lunch menu

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (create `.env.local` if needed)

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page auto-updates as you make changes to the source files.

### Build

Create an optimized production build:

```bash
npm run build
npm run start
```

## Database

This project uses Drizzle ORM for database management. Schema definitions are located in [drizzle/schema.ts](drizzle/schema.ts).

Configure your database connection in [src/lib/db.ts](src/lib/db.ts).

## Development

- Edit pages in the `src/app` directory to add new routes
- Create new components in `src/components`
- Add API routes in `src/app/api`
- Update database schema in `drizzle/schema.ts`

## Deployment

The application is optimized for deployment on [Vercel](https://vercel.com). Follow the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for other hosting options.
