const FIND_USER = `SELECT "uname" FROM "public"."users" WHERE "uname" = $1 LIMIT 1`;

const GET_IDENTITY_TOKEN = `
  SELECT "id" FROM "public"."identity_tokens"
  WHERE "user" = $1
    AND "is_valid" = true
    AND "expires_at" > NOW()
  LIMIT 1
`;

const CREATE_IDENTITY_TOKEN = `
  INSERT INTO "public"."identity_tokens" ("user") 
  VALUES ($1)
  RETURNING "id"
`;

const getIdentityToken = async (request, uname) => {
  const r1 = await request.pg.query(GET_IDENTITY_TOKEN, [uname]);
  if (r1.rowCount) {
    return r1.rows[0].id;
  }

  const r2 = await request.pg.query(CREATE_IDENTITY_TOKEN, [uname]);
  return r2.rows[0].id;
};

module.exports = async (request, reply) => {
  const { uname } = request.params;
  // Validate the User Identity
  const r1 = await request.pg.query(FIND_USER, [uname]);
  if (r1.rowCount !== 1) {
    reply.code(404).send("User not found");
    return;
  }

  // Produce the Identity Token
  const identityToken = await getIdentityToken(request, uname);

  // Send out Cookie and Redirect
  reply
    .type("text/html")
    .setCookie("auth", identityToken, {
      path: "/",
      httpOnly: true
    })
    .send(`<script>window.location = "/tenants";</script>`);
};
