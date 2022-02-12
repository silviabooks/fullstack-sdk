const FIND_USER = `SELECT * FROM "public"."users" WHERE "uname" = $1 LIMIT 1`;

module.exports = async (request, reply) => {
  // Validate username
  const res = await request.pg.query(FIND_USER, [request.params.uname]);
  if (res.rowCount !== 1) {
    reply.code(404).send("User not found");
    return;
  }

  // Produce JWT & send away
  const jwt = await request.jwt.sign(res.rows[0]);
  reply
    .type("html")
    .setCookie("auth", jwt, {
      path: "/",
      httpOnly: true
    })
    .send(`<script>window.location = "/tenants";</script>`);
};
