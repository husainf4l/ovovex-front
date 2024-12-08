import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Path setup for ES Modules
const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Initialize Express app
const app = express();
const angularApp = new AngularNodeAppEngine();

// Centralized Logging Function
const log = (message: string) => console.log(`[${new Date().toISOString()}] ${message}`);

// Global Error Handlers
process.on('uncaughtException', (err) => {
  console.error("Critical Error - Uncaught Exception:", err);
});
process.on('unhandledRejection', (reason) => {
  console.error("Critical Error - Unhandled Rejection:", reason);
});

// // Security Headers Middleware
// app.use(helmet());
// app.use((req, res, next) => {
//   res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   res.setHeader('X-Frame-Options', 'DENY');
//   next();
// });

// Middleware for performance optimization
app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json({ limit: '10kb' }));

// Rate Limiting for APIs
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many API requests, please try again later.',
  })
);

// Logging Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve Static Files
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

// Angular SSR Handler
app.use('/**', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await angularApp.handle(req);
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found.',
  });
});

// Centralized Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error Occurred:", {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
  });
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error.',
  });
});


const PORT = 4000;
app.listen(PORT, () => log(`Server is running on http://localhost:${PORT}`));


export const reqHandler = createNodeRequestHandler(app);
