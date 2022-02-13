const REFRESH_TOKEN = `
  WITH 
    "burn_token" AS (
      UPDATE "public"."refresh_tokens"
        SET "was_used" = true
      WHERE "id" IN (
        SELECT "id" FROM "public"."refresh_tokens"
        WHERE "id" = $1
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING "session_token" 
    ),
    "refresh_token" AS (
      INSERT INTO "public"."refresh_tokens"
      ("session_token") SELECT "session_token" FROM "burn_token"
      RETURNING "id", "session_token", "expires_at"
    )
  SELECT
    "session_token" AS "sessionToken",
    "id" AS "refreshToken",
    "expires_at" AS "expires"
  FROM "refresh_token"
`;

module.exports = async (request, reply) => {
  const res = await request.pg.query(REFRESH_TOKEN, [
    request.auth.refreshToken
  ]);

  // This should be a crazy racing condition
  // not really sure it is a realistic possibility.
  if (!res.rowCount) {
    console.warn("TODO: Invalidate the SessionToken");
    reply.status(400).send("Failed to refresh the token");
    return;
  }

  // Generate the ApplicationToken
  const { sessionToken, refreshToken, expires } = res.rows[0];
  const applicationToken = await request.jwt.sign({
    "x-auth-claims": {
      "x-auth-session-token": sessionToken,
      "x-auth-session-expires": expires
    }
  });

  reply.send({
    sessionToken,
    refreshToken,
    applicationToken,
    expires
  });
};
