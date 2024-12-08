import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender, // Static rendering for the homepage
  },
  {
    path: 'login',
    renderMode: RenderMode.Server, // Client-side rendering for the login page
  },
  {
    path: 'signup',
    renderMode: RenderMode.Server, // Client-side rendering for the signup page
  },
  {
    path: 'app',
    renderMode: RenderMode.Server, // Dynamic server-side rendering for the app dashboard
  },
  {
    path: '**',
    renderMode: RenderMode.Server, // Server-side rendering for all other routes
  },
];
