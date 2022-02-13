const REFRESH_TOKEN = `
WITH 
  "lock_session_token" AS (    
    SELECT "session_token" FROM "public"."refresh_tokens"
    WHERE "id" = $1
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  ),
  "refresh_token" AS (
    INSERT INTO "public"."refresh_tokens"
    ("session_token") SELECT * FROM "lock_session_token"
    RETURNING *
  ),
  "burn_token" AS (
    UPDATE "public"."refresh_tokens"
       SET "was_used" = true
     WHERE "id" = $1
  )
SELECT
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

  reply.send(res.rows[0]);
};
