import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import path, { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

console.log('Debug: Server script starting...');

const serverDistFolder = path.dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
// const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('Debug: Server script starting... 1');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

console.log('Debug: Server script starting... 2');

const app = express();
const angularApp = new AngularNodeAppEngine();

console.log('Debug: Server script starting... 3');

app.use((req, res, next) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

console.log('Debug: Server script starting... 4');

// Middleware
app.use(compression({ level: 6, threshold: 1024 }));
app.use(express.json({ limit: '10kb' }));

console.log('Debug: Server script starting... 5');

// Rate limiter for API
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many API requests, please try again later.',
  })
);

app.get('/robots.txt', (req, res) => {
  res.sendFile(join(browserDistFolder, '/assets/robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(join(browserDistFolder, '/assets/sitemap.xml'));
});

console.log('Debug: Server script starting... 6');

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode
      } (${duration}ms)`
    );
  });
  next();
});

console.log('Debug: Server script starting... 7');

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

console.log('Debug: Server script starting... 8');

// Angular SSR handler
app.use('/**', (req: Request, res: Response, next: NextFunction) => {

  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

app.use(
  helmet({
    contentSecurityPolicy: false, // Disable if CSP rules are not yet configured
  })
);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

console.log('Debug: Server script starting... 9');

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

console.log('Debug: Server script starting... 10');

const port = process.env['PORT'] || 4000;
console.log(`Debug: Preparing to start server on port ${port}...`); // Added log

try {
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`); // Log when the server starts
  });
  console.log('Debug: app.listen() executed successfully.'); // Log after listen
} catch (error) {
  console.error('Error in app.listen:', error); // Log any errors
}

console.log('Debug: Server script starting... 11');

export const reqHandler = createNodeRequestHandler(app);
