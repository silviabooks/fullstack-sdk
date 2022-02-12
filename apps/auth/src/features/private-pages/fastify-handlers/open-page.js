const GET_APP = `
  SELECT "t1"."url" FROM "public"."apps" AS "t1"
  LEFT JOIN "public"."catalog" AS "t2" ON "t1"."name" = "t2"."name"
  WHERE "t1"."name" = $1 
    AND "t2"."user" = $2
    AND "t2"."tenant" = $3
  LIMIT 1;
`;

const GET_TOKEN = `
  INSERT INTO "public"."family_tokens"
  ("user", "tenant", "app") VALUES 
  ($1, $2, $3) 
  RETURNING "id" AS "x-auth-id";
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
  const family = await request.pg.query(GET_TOKEN, [user, tenant, app]);
  const token = await request.jwt.sign(family.rows[0], {
    expiresIn: "30s"
  });

  // Build the token payload:
  const { url } = res.rows[0];

  reply.type("text/html").send(`
    <script>window.location = "${url}?token=${token}"</script>
  `);
};
