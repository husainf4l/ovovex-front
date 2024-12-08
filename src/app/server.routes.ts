import { ServerRoute, RenderMode } from '@angular/ssr';


export const serverRoutes: ServerRoute[] = [
    {
        path: '', // Root route (e.g., homepage)
        renderMode: RenderMode.Prerender, // Static rendering for SEO
    },
    {
        path: 'login', // Login route
        renderMode: RenderMode.Server, // Use server-side rendering for styles
    },
    {
        path: 'signup', // Signup route
        renderMode: RenderMode.Server, // Use server-side rendering for styles
    },
    {
        path: 'app', // Dashboard route
        renderMode: RenderMode.Server, // Server-side rendering for dynamic data
    },
    {
        path: '**', // Catch-all route
        renderMode: RenderMode.Server, // Handled dynamically by the server
    },
];
