/*
export default function IndexRoute(request: Request): Response {
  return new Response("Hello World", { status: 200 });
}
*/
export default function IndexRoute(request: Request): any {
  return { body: "Hello World", status: 200 };
}
