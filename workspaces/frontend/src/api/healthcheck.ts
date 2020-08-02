export const healthcheck = (serverAddress: string) =>
  fetch(`${serverAddress}/__healthcheck`).then((res) => {
    console.log("@res", res);
    return res.status === 200;
  });
