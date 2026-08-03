import { NextResponse } from "next/server";

const error = { type: "object", properties: { error: { type: "string" } } };
export async function GET() {
  return NextResponse.json({ openapi: "3.0.3", info: { title: "Flowerchi Client API", version: "1.0.0", description: "API for Flowerchi mobile clients. Amounts are in toman (IRT)." }, servers: [{ url: "/api" }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "Flowerchi access token" } }, schemas: { Error: error } },
    paths: {
      "/v1/auth/login": { post: { summary: "Customer login", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password"], properties: { email: { type: "string", format: "email" }, password: { type: "string", format: "password" } } } } } }, responses: { "200": { description: "Bearer access token" }, "401": { description: "Invalid credentials", content: { "application/json": { schema: error } } } } } },
      "/v1/catalog": { get: { summary: "Public active catalog", responses: { "200": { description: "Platforms, categories, and services" } } } },
      "/v1/me": { get: { summary: "Authenticated customer profile", security: [{ bearerAuth: [] }], responses: { "200": { description: "Profile" }, "401": { description: "Unauthorized" } } } },
      "/v1/orders": { get: { summary: "Authenticated customer's orders", security: [{ bearerAuth: [] }], responses: { "200": { description: "Order history" }, "401": { description: "Unauthorized" } } } },
      "/checkout": { post: { summary: "Create order and return Zarinpal payment URL", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "serviceId", "quantity", "target"], properties: { name: { type: "string" }, email: { type: "string", format: "email" }, serviceId: { type: "string", format: "uuid" }, quantity: { type: "integer", minimum: 1 }, target: { type: "string" } } } } } }, responses: { "201": { description: "Order reference and payment URL" }, "400": { description: "Invalid order details" }, "429": { description: "Rate limited" } } } },
    },
  });
}
