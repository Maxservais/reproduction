# Cloudflare Workers Reproduction

## Setup Steps

1. **Backend Setup**

   ```bash
   cd testing-hono
   pnpm install
   npx wrangler d1 migrations apply test-db --local
   ```

2. **Frontend Setup**

   ```bash
   cd my-react-router-app
   pnpm install
   ```

3. **Start Backend**

   ```bash
   cd testing-hono
   pnpm run dev
   ```

4. **Start Frontend**
   ```bash
   cd my-react-router-app
   pnpm run dev
   ```
