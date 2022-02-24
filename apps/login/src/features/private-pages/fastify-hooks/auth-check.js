const VALIDATE_IDENTITY_TOKEN = `
  SELECT "id", "uname" FROM "login"."identity_tokens" AS "t1"
  LEFT JOIN "login"."users" AS "t2" ON "t1"."user" = "t2"."uname"
  WHERE "t1"."id" = $1
    AND "t1"."is_valid" = true
    AND "t1"."expires_at" > NOW()
  LIMIT 1
`;

module.exports = async (request, reply) => {
  // Validate the Identity Token agains the DB:
  const identityToken = request.cookies["x-identity-token"];
  const res = await request.pg.query(VALIDATE_IDENTITY_TOKEN, [identityToken]);

  // Block access for invalid requests:
  if (!res.rowCount) {
    reply
      .status(401)
      .type("text/html")
      .send(`<h1>Access denied</h1><a href="/">Login</a>`);
    return;
  }

  // Decorate the request with the Identity Token informations:
  request.auth = res.rows[0];
};
