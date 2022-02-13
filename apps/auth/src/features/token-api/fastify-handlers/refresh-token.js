const REFRESH_TOKEN = `
WITH 
  "lock_token" AS (
    SELECT "family_token" FROM "public"."refresh_tokens"
    WHERE "id" = $1
    FOR UPDATE SKIP LOCKED
  ),
  "refresh_token" AS (
    INSERT INTO "public"."refresh_tokens"
    ("family_token") SELECT * FROM "lock_token"
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

  if (!res.rowCount) {
    console.warn("TODO: Invalidate the entire family");
    reply.status(400).send("Failed to refresh the token");
    return;
  }

  reply.send(res.rows[0]);
};
