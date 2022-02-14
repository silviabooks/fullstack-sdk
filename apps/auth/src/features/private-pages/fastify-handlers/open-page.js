const GET_APP = `
  SELECT "t1"."url" FROM "public"."apps" AS "t1"
  LEFT JOIN "public"."catalog" AS "t2" ON "t1"."name" = "t2"."name"
  WHERE "t1"."name" = $1 
    AND "t2"."user" = $2
    AND "t2"."tenant" = $3
  LIMIT 1;
`;

const GET_REFRESH_TOKEN = `
WITH 
  session_token AS (
    INSERT INTO "public"."session_tokens"
      ("identity_token", "claims") VALUES 
      ($1, $2) 
    ON CONFLICT ON CONSTRAINT "session_tokens_pkey"
    DO UPDATE SET "created_at" = EXCLUDED."created_at"
    RETURNING "id"
  ),
  refresh_token AS (
    INSERT INTO "public"."refresh_tokens"
      ("session_token", "expires_at") VALUES 
      (
        (SELECT "id" from "session_token"),
        NOW() + $3::interval
      ) 
    RETURNING "id"
  )
  SELECT "id" AS "delegateToken" FROM refresh_token;
`;

module.exports = async (request, reply) => {
  const { id: identityToken, uname } = request.auth;
  const { tenant, app } = request.params;

  // Get the App's URL:
  const r1 = await request.pg.query(GET_APP, [app, uname, tenant]);
  if (r1.rowCount === 0) {
    reply.status(404).send("App not found");
    return;
  }

  // Build the Refresh Token:
  // NOTE: this first Refresh Token is intended for immediate utilization
  //       from the target App as it will be passed down via URI parameter
  //       and it is particularly sensible to leakage.
  //       It takes the name of DELEGATION TOKEN
  const r2 = await request.pg.query(GET_REFRESH_TOKEN, [
    identityToken,
    JSON.stringify({
      uname,
      tenant,
      app
    }),
    "5s"
  ]);

  // Get data for the template:
  const { url } = r1.rows[0];
  const token = r2.rows[0].delegateToken;

  reply.type("text/html").send(`
    <script>window.location = "${url}?token=${token}"</script>
  `);
};
