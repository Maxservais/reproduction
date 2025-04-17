import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { cors } from "hono/cors";
import { users } from "./schema";

type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

// Add CORS middleware
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8787",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.json({ status: "ok" });
});

app.get("/test-db", async (c) => {
  try {
    const db = drizzle(c.env.DB);
    const results = await db.select().from(users).all();
    return c.json({ success: true, data: results });
  } catch (error) {
    console.error("DB Error:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default app;
