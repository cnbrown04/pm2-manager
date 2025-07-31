# PM2 Manager

A modern web application for managing PM2 processes built with React, TanStack Router, and Tailwind CSS.

## Features

- Modern React 19 application
- TanStack Router for client-side routing
- shadcn/ui components with Tailwind CSS
- TypeScript support
- Vite for fast development and building

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Routing**: TanStack Router with TanStack Start
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Build Tool**: Vite
- **Package Manager**: Bun (lockfile present)
- **UI Components**: 
  - Radix UI primitives
  - shadcn/ui component library
  - Lucide React icons
  - Class Variance Authority for component variants

## Getting Started

### Prerequisites

- Node.js (version compatible with React 19)
- Bun (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pm2-manager
```

2. Install dependencies:
```bash
bun install
```

### Development

Start the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Building

Build the application for production:
```bash
bun run build
```

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
│       └── button.tsx
├── lib/
│   └── utils.ts      # Utility functions
├── routes/           # TanStack Router routes
│   ├── __root.tsx    # Root layout component
│   └── index.tsx     # Home page
├── styles/
│   └── app.css       # Global styles with Tailwind
├── routeTree.gen.ts  # Generated route tree
└── router.tsx        # Router configuration
```

## Configuration Files

- `components.json` - shadcn/ui configuration
- `vite.config.ts` - Vite configuration with TanStack Start
- `tsconfig.json` - TypeScript configuration
- `postcss.config.ts` - PostCSS configuration for Tailwind

## Available Scripts

- `dev` - Start development server
- `build` - Build for production

## License

This project is open source and available under the [MIT License](LICENSE).
