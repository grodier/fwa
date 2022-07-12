export default function AboutRoute(request: Request): Response {
  return new Response("About Page", { status: 200 });
}
