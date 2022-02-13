const FIND_USER = `SELECT "uname" FROM "public"."users" WHERE "uname" = $1 LIMIT 1`;
const LOGIN_USER = `
  INSERT INTO "public"."identity_tokens" ("user") 
  VALUES ($1)
  RETURNING "id"
`;

module.exports = async (request, reply) => {
  const { uname } = request.params;
  // Validate username
  const r1 = await request.pg.query(FIND_USER, [uname]);
  if (r1.rowCount !== 1) {
    reply.code(404).send("User not found");
    return;
  }

  // Produce a new IdentityToken
  const r2 = await request.pg.query(LOGIN_USER, [uname]);
  const loginId = r2.rows[0].id;

  // Send out Cookie and Redirect
  reply
    .type("text/html")
    .setCookie("auth", loginId, {
      path: "/",
      httpOnly: true
    })
    .send(`<script>window.location = "/tenants";</script>`);
};
