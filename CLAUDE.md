# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Afore Italy website - a dynamic website server built with Express.js and EJS templates that features intelligent CDN support for automatic asset URL transformation. The server uses shared header/footer partials to eliminate code duplication and can dynamically replace local `image/` and `video/` paths with CDN URLs in rendered templates.

## Development Commands

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# PM2 process management
npm run pm2:start     # Start production cluster
npm run pm2:stop      # Stop all instances
npm run pm2:restart   # Restart all instances
npm run pm2:logs      # View logs
npm run pm2:status    # Check status
```

## Architecture

### Core Components

- **`src/server.js`**: Main Express server with EJS template rendering and dynamic routing
- **`src/middleware/cdn.js`**: CDN transformation middleware that processes rendered EJS templates
- **`views/`**: EJS templates and partials
  - `views/partials/header.ejs`: Shared header with navigation
  - `views/partials/footer.ejs`: Shared footer with newsletter and social links
  - `views/*.ejs`: Individual page templates
- **`static/`**: All static assets (CSS, images, videos, JavaScript)
- **`ecosystem.config.js`**: PM2 configuration for production deployment

### CDN System

The CDN middleware (`src/middleware/cdn.js:30-87`) automatically transforms asset paths in rendered EJS templates:
- Intercepts the `res.render()` method to process template output
- Replaces `image/` and `video/` paths in `src`, `href`, `poster` attributes
- Handles CSS `url()` references and inline styles
- Avoids processing already-transformed URLs (those starting with `https://`)
- Works seamlessly with EJS template system

### Environment Configuration

Required environment variables for CDN mode:
- `ENABLE_CDN=true` - Activates CDN transformation
- `CDN_HOST` - Base CDN URL (e.g., `https://cdn.example.com`)
- `CDN_PATH_PREFIX` - Optional path prefix (e.g., `/assets`)
- `PORT` - Server port (defaults to 3000)

### Template Structure

The website uses EJS templates with shared partials to eliminate code duplication:
- **Templates**: Located in `views/` directory
  - `homepage.ejs` - Main landing page (served at `/`)
  - `prodotti.ejs` - Products page with interactive tabs and product grids
  - `soluzione.ejs` - Solutions page
  - `chieafore.ejs` - About Afore page
  - `contatti.ejs` - Contact page
  - `documentazione.ejs` - Documentation
  - `assistenza.ejs` - Support page
  - `eventi.ejs` - Events page

- **Partials**: Shared components in `views/partials/`
  - `header.ejs` - Common header with navigation menu
  - `footer.ejs` - Common footer with newsletter signup and social links

- **Route Mapping**: Server automatically maps routes to templates with page-specific titles and stylesheets

All pages share assets from `static/image/` and `static/video/` directories.

## Production Deployment

The project uses PM2 for production deployment with cluster mode:
- **Production**: Multi-instance cluster mode on port 3000
- **Development**: Single instance with file watching on port 3001
- Logs are written to `logs/` directory
- Auto-restart with memory limits and retry policies

## Key Implementation Details

- **EJS Template Engine**: Uses EJS for server-side rendering with shared partials
- **Dynamic Routing**: Server automatically maps routes to templates using `pageRoutes` configuration
- **CDN Integration**: CDN transformation happens after template rendering, not build time
- **Shared Components**: Header and footer are centralized in partials to eliminate duplication
- **404 Handling**: Falls back to homepage template for non-existent routes
- **Asset Management**: All static assets served from `static/` directory
- **Template Variables**: Each route passes specific title and stylesheet to templates
- **Middleware Integration**: CDN middleware intercepts `res.render()` for seamless URL transformation