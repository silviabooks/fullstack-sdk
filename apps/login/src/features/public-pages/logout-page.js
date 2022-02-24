/**
 * LOGOUT SHOULD BE A PRIVATE PAGE
 * and it should invalidate the Identity Token,
 * hence effectively logging out from any 3rd party app.
 *
 * @param {*} request
 * @param {*} reply
 */

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
