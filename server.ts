import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieSession from "cookie-session";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());
const isProd = process.env.NODE_ENV === 'production' || !!process.env.APP_URL;
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'mavestone-secret-key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  proxy: true
}));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.APP_URL 
    ? (process.env.APP_URL.endsWith('/') ? `${process.env.APP_URL}auth/callback` : `${process.env.APP_URL}/auth/callback`)
    : 'http://localhost:3000/auth/callback'
);

// API Routes
app.get("/api/auth/google/url", (_req: Request, res: Response) => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  res.json({ url });
});

app.get("/auth/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    console.log("Received tokens from Google:", !!tokens.access_token);
    // In a real app, you'd save these tokens to a database associated with the user
    // For this demo, we'll store them in the session
    (req as any).session.tokens = tokens;
    console.log("Stored tokens in session, session is now:", !!(req as any).session.tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    oauth2Client.setCredentials(tokens);
    const userInfo = await oauth2.userinfo.get();

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'GMAIL_AUTH_SUCCESS', 
                email: '${userInfo.data.email}',
                tokens: ${JSON.stringify(tokens)}
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. You can close this window.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/gmail/status", (req: Request, res: Response) => {
  const headerTokens = req.headers['x-gmail-tokens'];
  let tokens = (req as any).session?.tokens;
  
  if (!tokens && headerTokens) {
    try {
      tokens = JSON.parse(headerTokens as string);
      console.log("Using tokens from header for status check");
    } catch (e) {}
  }

  console.log("Checking Gmail status, tokens found:", !!tokens);
  if (tokens) {
    res.json({ isConnected: true });
  } else {
    res.json({ isConnected: false });
  }
});

app.post("/api/gmail/disconnect", (req: Request, res: Response) => {
  console.log("Disconnecting Gmail");
  (req as any).session = null;
  res.json({ success: true });
});

app.post("/api/gmail/send", async (req: Request, res: Response) => {
  const headerTokens = req.headers['x-gmail-tokens'];
  let tokens = (req as any).session?.tokens;

  if (!tokens && headerTokens) {
    try {
      tokens = JSON.parse(headerTokens as string);
      console.log("Using tokens from header for sending");
    } catch (e) {}
  }

  console.log("Attempting to send email, tokens found:", !!tokens);
  if (!tokens) {
    return res.status(401).json({ error: "Not connected to Gmail" });
  }

  const { to, subject, content } = req.body;
  
  try {
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.APP_URL 
        ? (process.env.APP_URL.endsWith('/') ? `${process.env.APP_URL}auth/callback` : `${process.env.APP_URL}/auth/callback`)
        : 'http://localhost:3000/auth/callback'
    );
    auth.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth });

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      `From: Liam <hello@mavestone.com>`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      content,
    ];
    const message = messageParts.join('\r\n');

    // The body needs to be base64url encoded.
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const sent = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    res.json({ success: true, threadId: sent.data.threadId });
  } catch (error: any) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      error: "Failed to send email", 
      details: error.message,
      code: error.code
    });
  }
});

app.get("/api/gmail/replies", async (req, res) => {
  try {
    const tokens = getTokens(req);
    if (!tokens) return res.status(401).json({ error: "Not connected to Gmail" });

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.APP_URL 
        ? (process.env.APP_URL.endsWith('/') ? `${process.env.APP_URL}auth/callback` : `${process.env.APP_URL}/auth/callback`)
        : 'http://localhost:3000/auth/callback'
    );
    auth.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth });

    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10
    });

    const messages = response.data.messages || [];
    const replies = [];

    for (const msg of messages) {
      const detail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id!
      });
      
      const headers = detail.data.payload?.headers;
      const from = headers?.find(h => h.name === 'From')?.value;
      const threadId = detail.data.threadId;

      if (from && !from.includes('hello@mavestone.com')) {
        let content = '';
        if (detail.data.payload?.parts) {
          const textPart = detail.data.payload.parts.find(p => p.mimeType === 'text/plain');
          if (textPart && textPart.body?.data) {
            content = Buffer.from(textPart.body.data, 'base64').toString();
          }
        } else if (detail.data.payload?.body?.data) {
          content = Buffer.from(detail.data.payload.body.data, 'base64').toString();
        }

        replies.push({
          threadId,
          from,
          content: content.split('\n')[0], // Just first line for preview
          timestamp: new Date(parseInt(detail.data.internalDate!)).toISOString()
        });
      }
    }

    res.json({ replies });
  } catch (error: any) {
    console.error("Error fetching replies:", error);
    res.status(500).json({ error: "Failed to fetch replies", details: error.message });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
