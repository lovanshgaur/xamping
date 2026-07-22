import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import appCss from "../styles.css?url";
import { AppShell } from "@/components/layout/AppShell";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { reportLovableError } from "@/lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-3 display-xl">Page not found.</h1>
        <p className="mt-3 text-sm text-muted-foreground">The route you followed doesn’t exist.</p>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="text-center">
        <p className="eyebrow">Interrupted</p>
        <h1 className="mt-3 display-xl">This page didn’t load.</h1>
        <p className="mt-3 text-sm text-muted-foreground">Try again, or return home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-[6px] bg-foreground px-4 py-2 text-sm text-background"
          >
            Try again
          </button>
          <a href="/" className="rounded-[6px] hairline px-4 py-2 text-sm">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}


export const Route = createRootRouteWithContext()({
  head: () => ({
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700&family=Inter+Tight:wght@400;500;600&family=Inter:wght@400;500;600&family=Silkscreen:wght@400;700&display=swap",
      },
      { rel: "icon", href: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { rel: "icon", href: "/app-icon-192.png", type: "image/png", sizes: "192x192" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
    ],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "BootXamp — Career Operating System" },
      {
        name: "description",
        content:
          "BootXamp is a personal Career Operating System for a 7-week apprenticeship — a data-driven daily workspace for learning, building, and career progression.",
      },
      { name: "author", content: "BootXamp" },
      { name: "theme-color", content: "#0f0f0f" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-title", content: "BootXamp" },
      { name: "mobile-web-app-capable", content: "yes" },
      { property: "og:title", content: "BootXamp — Career Operating System" },
      {
        property: "og:description",
        content: "Editorial, data-driven daily workspace for a 7-week frontend apprenticeship.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingScreen />
      <AppShell>
        <Outlet />
      </AppShell>
    </QueryClientProvider>
  );
}
