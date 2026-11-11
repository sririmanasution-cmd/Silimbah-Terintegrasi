import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// In AI Studio, Nginx listens on PORT (8080) and proxies to port 3000 (DEFAULT_APP_PORT).
// The Node app must bind to port 3000 to prevent EADDRINUSE collisions.
const PORT = parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);
const HOST = '0.0.0.0';

// Health check endpoint for Cloud Run deployment probes
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Path to built static assets
const distPath = path.join(__dirname, 'dist');

// Serve static assets from Vite build directory
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback: return index.html for all non-file routes
  app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(200).send('SiLimbah is starting up...');
    }
  });
} else {
  // Graceful fallback if dist is building
  app.get('*', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>SiLimbah</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2>SiLimbah sedang menyiapkan sistem...</h2>
          <p>Silakan muat ulang halaman dalam beberapa saat.</p>
        </body>
      </html>
    `);
  });
}

app.listen(PORT, HOST, () => {
  console.log(`[SiLimbah Production Server] Berjalan pada http://${HOST}:${PORT}`);
});
