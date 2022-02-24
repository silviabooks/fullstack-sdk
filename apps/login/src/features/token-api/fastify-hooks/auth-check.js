const VALIDATE_REFRESH_TOKEN = `
  SELECT 
    "t1"."id" AS "refreshToken",
    "t2"."id" AS "sessionToken",
    LEAST("t1"."expires_at", "t2"."expires_at") AS "expiresAt"
  FROM "login"."refresh_tokens" AS "t1"
  LEFT JOIN "login"."session_tokens" AS "t2" ON "t1"."session_token" = "t2"."id"
  LEFT JOIN "login"."identity_tokens" AS "t3" ON "t2"."identity_token" = "t3"."id"
  WHERE "t1"."id" = $1
    AND "t1"."is_valid" = true
    AND "t1"."expires_at" > NOW()
    AND "t2"."is_valid" = true
    AND "t2"."expires_at" > NOW()
    AND "t3"."is_valid" = true
    AND "t3"."expires_at" > NOW()
  LIMIT 1
`;

const INVALIDATE_SESSION_TOKEN = `
WITH
  "invalidate_session_tokens" AS (
    UPDATE "login"."session_tokens"
      SET "is_valid" = false
    WHERE "id" IN (
      SELECT "t1"."session_token" FROM "login"."refresh_tokens" AS "t1"
      INNER JOIN "login"."session_tokens" AS "t2" ON "t1"."session_token" = "t2"."id"
      WHERE "t1"."id" = $1 
      LIMIT 1
      FOR UPDATE SKIP LOCKED
    )
    RETURNING "id"
  ),
  "invalidate_refresh_tokens" AS (
    UPDATE "login"."refresh_tokens"
       SET "is_valid" = false
     WHERE "is_valid" = true
       AND "session_token" IN (
         SELECT "id" FROM "invalidate_session_tokens"
       )
  )
SELECT * FROM "invalidate_session_tokens"
`;

module.exports = async (request, reply) => {
  // Get the Refresh Token from the headers:
  // (straight header or cookie)
  const authToken =
    request.headers["x-refresh-token"] || request.cookies["x-refresh-token"];
  if (!authToken) {
    reply.status(401).send("Access denied - authentication not found");
    return;
  }

  // Validate the RefreshToken:
  const r1 = await request.pg.query(VALIDATE_REFRESH_TOKEN, [authToken]);
  if (r1.rowCount === 1) {
    request.auth = r1.rows[0];
    return;
  }

  // Invalidate the SessionToken:
  await request.pg.query(INVALIDATE_SESSION_TOKEN, [authToken]);
  reply.status(428).send("Access denied - invalid token");
};
