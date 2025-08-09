# Deployment Guide - Jackboard Auto

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment Options

### 1. Static Hosting (Netlify, Vercel, GitHub Pages)

```bash
# Build project
npm run build

# Upload dist/ folder to your hosting service
```

### 2. Traditional Web Server

```bash
# Build project
npm run build

# Copy dist/ contents to web server directory
# Configure server for SPA routing
```

### 3. Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npx", "serve", "-s", "dist", "-l", "80"]
```

## Environment Variables

No environment variables required - this is a client-only application.

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Optimization

- Bundle size: ~492KB (gzipped: ~161KB)
- Uses WebGL for rendering
- Automatic performance monitoring
- Responsive design for mobile

## Security Considerations

- Client-only application
- No server-side processing
- Uses browser APIs only
- CORS-compliant RSS feeds