import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import chatHandler from './api/chat.js';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables so process.env.GEMINI_API_KEY is available to serverless handler in dev
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      {
        name: 'spacio-api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/chat' || req.url?.startsWith('/api/chat?') || req.url === '/api/status') {
              try {
                await chatHandler(req, res);
              } catch (err) {
                console.error('[API Middleware Error]', err);
                if (!res.headersSent) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({
                    error: 'SERVER_ERROR',
                    message: 'Internal server error in API middleware',
                  }));
                }
              }
              return;
            }
            next();
          });
        },
      },
    ],
  };
});
