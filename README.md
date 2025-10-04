# Tubo - YouTube Video Downloader

A desktop application built with React Router, Express.js backend, and Electron.

## Project Structure

```
tubo/
├── app/                    # React Router frontend
│   ├── routes/            # Frontend routes
│   └── global.d.ts        # TypeScript global types
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── server.ts      # Main server file
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Request handlers
│   │   └── middleware/    # Express middleware
│   └── tsconfig.json      # Backend TypeScript config
├── electron/              # Electron desktop wrapper
│   ├── main.ts           # Electron main process
│   ├── preload.ts        # Electron preload script
│   └── tsconfig.json     # Electron TypeScript config
└── package.json          # Project dependencies and scripts
```

## Architecture

- **Frontend**: React Router (Vite) - runs on `http://localhost:5173`
- **Backend**: Express.js with TypeScript - runs on `http://localhost:3001`
- **Desktop**: Electron - wraps the frontend in a desktop application

## Development

### Run everything together (recommended)

```bash
npm run dev:all
```

This will start:

- Backend server on port 3001
- Frontend dev server on port 5173
- Electron app window

### Run individually

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev

# Electron only (requires backend and frontend running)
npm run dev:electron
```

## Building for Production

```bash
# Build all components
npm run build

# Build individually
npm run build:backend    # Compiles backend TypeScript
npm run build:frontend   # Builds React Router app
npm run build:electron   # Compiles Electron TypeScript

# Create Electron distributable
npm run electron:build
```

## Scripts

- `npm run dev:all` - Start backend, frontend, and Electron together
- `npm run dev:backend` - Start Express backend with hot reload
- `npm run dev` - Start React Router dev server
- `npm run dev:electron` - Start Electron in development mode
- `npm run build` - Build all components
- `npm run start` - Start production backend server
- `npm run typecheck` - Type check the frontend

## Tech Stack

- **Frontend**: React 19, React Router 7, TailwindCSS 4
- **Backend**: Express.js 5, TypeScript
- **Desktop**: Electron 38
- **Build Tools**: Vite, TypeScript, tsx

## Next Steps

1. Implement video download API endpoints in `backend/src/routes/`
2. Add download controllers in `backend/src/controllers/`
3. Update frontend to call the download endpoints
4. Add progress tracking and notifications
