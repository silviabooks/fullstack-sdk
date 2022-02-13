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
      ("user", "tenant", "app") VALUES 
      ($1, $2, $3) 
    RETURNING "id"
  ),
  refresh_token AS (
    INSERT INTO "public"."refresh_tokens"
      ("session_token", "expires_at") VALUES 
      (
        (SELECT "id" from "session_token"),
        NOW() + $4::interval
      ) 
    RETURNING "id"
  )
  SELECT * FROM refresh_token;
`;

module.exports = async (request, reply) => {
  const { uname: user } = request.auth;
  const { tenant, app } = request.params;

  // Get the App's URL:
  const res = await request.pg.query(GET_APP, [app, user, tenant]);
  if (res.rowCount === 0) {
    reply.status(404).send("App not found");
    return;
  }

  // Build a family token:
  // NOTE: this first refresh token is intended for immediate utilization
  //       from the target App as it will be passed down via URI parameter
  //       and it is particularly sensible to leakage.
  const family = await request.pg.query(GET_REFRESH_TOKEN, [
    user,
    tenant,
    app,
    "5s"
  ]);
  const token = family.rows[0].id;

  // Build the token payload:
  const { url } = res.rows[0];

  reply.type("text/html").send(`
    <script>window.location = "${url}?token=${token}"</script>
  `);
};
