module.exports = (request, reply) => {
  reply
    .type("text/html")
    .setCookie("auth", "-", {
      path: "/",
      httpOnly: true,
      expires: Date.now()
    })
    .send(`<script>window.location="/"</script>`);
};
