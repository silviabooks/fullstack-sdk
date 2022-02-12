module.exports = (request, reply) => {
  reply
    .type("html")
    .setCookie("auth", "-", {
      path: "/",
      httpOnly: true,
      expires: Date.now()
    })
    .send(`<script>window.location="/"</script>`);
};
