# ClearFlow Cleaning Operations

A responsive React dashboard for managing cleaning appointments, clients, team members, services, checklists, callbacks, and cleaning history.

## Portfolio demo

The deployed portfolio version includes a public evaluation login. Its credentials are displayed on the owner's portfolio rather than stored in this repository. The demo sign-in only gates the portfolio experience. Records are stored in the visitor's browser with `localStorage`; it is not a production authentication system.

## Local development

```bash
npm install
npm run dev
```

## Build and deploy to Cloudflare Workers

```bash
npm run build
npx wrangler deploy
```

The Worker configuration serves the Vite production build from `dist/` and falls back to the single-page application for client-side routes.

The optional `functions/` and `schema.sql` files are retained for the earlier Cloudflare Pages callback-request prototype. A production deployment should replace the public demo gate with server-side authentication and connect the callback tools to a secured database.

