import { createRequestHandler } from "react-router";
import type { ExecutionContext } from "@cloudflare/workers-types";

interface Env {
  BACKEND_SERVICE: {
    fetch(request: Request): Promise<Response>;
  };
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  VALUE_FROM_CLOUDFLARE: string;
}

declare global {
  interface CloudflareEnvironment extends Env {}
}

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: CloudflareEnvironment;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // Forward requests to /api/* to the backend service
    if (url.pathname.startsWith("/api/")) {
      console.log(`Forwarding request to BACKEND_SERVICE: ${url.pathname}`);

      // Create a new URL by stripping the /api prefix
      const backendUrl = new URL(url);
      backendUrl.pathname = url.pathname.replace(/^\/api/, "");

      // Create a new request for the backend service with the modified URL
      const backendRequest = new Request(backendUrl, {
        method: request.method,
        headers: new Headers(request.headers),
        body: request.body,
        redirect: request.redirect,
      });

      try {
        // Use the service binding to call the backend
        return await env.BACKEND_SERVICE.fetch(backendRequest);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return new Response(`Service Binding Error: ${errorMessage}`, {
          status: 500,
        });
      }
    }

    // For non-API requests, handle with React Router
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
};
