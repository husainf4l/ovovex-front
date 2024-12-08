import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import helmet from 'helmet';
import dotenvSafe from 'dotenv-safe';
import rateLimit from 'express-rate-limit';

const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Load environment variables
dotenvSafe.config({
  path: path.resolve(process.cwd(), '.env'), // Use process.cwd() for absolute path
  example: path.resolve(process.cwd(), '.env.example'), // Use process.cwd() for absolute path
});



const app = express();
const angularApp = new AngularNodeAppEngine();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src-elem': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'connect-src': ["'self'", 'https://ovovex.com'],
      'img-src': ["'self'", 'data:', 'https://firebasestorage.googleapis.com'],
      'default-src': ["'self'"],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
}));
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

// Middleware
app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json({ limit: '10kb' }));

// Rate limiter for API
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many API requests, please try again later.',
  })
);

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Static files
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    },
  })
);

// Angular SSR handler
app.use('/**', (req: Request, res: Response, next: NextFunction) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  console.error(`Request: ${req.method} ${req.url}`);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong. Please try again later.',
  });
});

// Start the server
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
