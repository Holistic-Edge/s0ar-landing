import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "RIZZ Manta Ray — Coming Soon" },
      {
        name: "description",
        content:
          "Something playfully luxurious is coming to Pattaya. Sign up for early access.",
      },
      { name: "author", content: "RIZZ Manta Ray" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "RIZZ Manta Ray — Coming Soon" },
      { name: "twitter:title", content: "RIZZ Manta Ray — Coming Soon" },
      { name: "description", content: "A teaser landing page for Rizz Manta Ray Ocean Club, offering a glimpse of luxury." },
      { property: "og:description", content: "A teaser landing page for Rizz Manta Ray Ocean Club, offering a glimpse of luxury." },
      { name: "twitter:description", content: "A teaser landing page for Rizz Manta Ray Ocean Club, offering a glimpse of luxury." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5db1246-db25-4cbc-aafa-640673a9fca2/id-preview-cc755bf1--cf90bf79-f94e-4909-ac4b-e13d9af628e3.lovable.app-1776828531579.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c5db1246-db25-4cbc-aafa-640673a9fca2/id-preview-cc755bf1--cf90bf79-f94e-4909-ac4b-e13d9af628e3.lovable.app-1776828531579.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,500&family=Work+Sans:wght@200;300;400;500&family=IBM+Plex+Mono:wght@300;400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return <Outlet />;
}
