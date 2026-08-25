# CineAI Studio V2

Real image-to-video MVP using fal.ai Pika 2.2.

## Setup
1. Install Node.js 20+.
2. Create a fal.ai account and API key.
3. Copy `.env.example` to `.env`.
4. Put your key in `FAL_KEY`.
5. Run:
   npm install
   npm start
6. Open http://localhost:3000

IMPORTANT: Never put FAL_KEY inside the browser/frontend. Keep it on the server.

The app accepts a reference image, prompt, 5/10 sec, aspect ratio and 720p/1080p.
