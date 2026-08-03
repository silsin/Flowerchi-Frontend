"use client";
import Script from "next/script";

export default function ApiDocsPage() {
  return <main style={{ minHeight: "100vh", background: "white" }}>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <div id="swagger-ui" />
    <Script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" strategy="afterInteractive" onLoad={() => {
      const swagger = (window as Window & { SwaggerUIBundle?: (options: unknown) => void }).SwaggerUIBundle;
      swagger?.({ url: "/api/openapi.json", dom_id: "#swagger-ui", deepLinking: true, persistAuthorization: true });
    }} />
  </main>;
}
