export const socketIoPreflightRequestHandler = (req: any, res: any) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, x-user-id, x-secret-token",
    "Access-Control-Allow-Origin": req.headers.origin,
    "Access-Control-Allow-Credentials": true,
  };
  res.writeHead(200, headers);
  res.end();
};
