export function basereq(req: Request): Request {
    req.headers.set("User-Agent", "Monazilla/1.00")
  return req;
}