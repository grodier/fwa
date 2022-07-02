export default function IndexRoute(request: Request): Response {
  return new Response("Hello World", { status: 200 });
}
