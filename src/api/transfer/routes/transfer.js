module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transfer",
      handler: "transfer.transfer",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
