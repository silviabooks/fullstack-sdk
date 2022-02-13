const VALIDATE_REFRESH_TOKEN = `
  SELECT 
    "t1"."id" AS "refreshToken",
    "t2"."id" AS "familyToken",
    LEAST("t1"."expires_at", "t2"."expires_at") AS "expiresAt"
  FROM "public"."refresh_tokens" AS "t1"
  LEFT JOIN "public"."session_tokens" AS "t2" ON "t1"."session_token" = "t2"."id"
  LEFT JOIN "public"."identity_tokens" AS "t3" ON "t2"."identity_token" = "t3"."id"
  WHERE "t1"."id" = $1
    AND "t1"."was_used" = false
    AND "t1"."expires_at" > NOW()
    AND "t2"."is_valid" = true
    AND "t3"."is_valid" = true
    AND "t3"."expires_at" > NOW()
  LIMIT 1
`;

const INVALIDATE_SESSION_TOKEN = `
  UPDATE "public"."session_tokens"
    SET "is_valid" = false
  WHERE "id" IN (
    SELECT "t1"."session_token" FROM "public"."refresh_tokens" AS "t1"
    INNER JOIN "public"."session_tokens" AS "t2" ON "t1"."session_token" = "t2"."id"
    WHERE "t1"."id" = $1 
    LIMIT 1
    FOR UPDATE SKIP LOCKED
  )
`;

module.exports = async (request, reply) => {
  // Get the Refresh Token from the headers:
  const authToken = request.headers["x-auth-id"];
  if (!authToken) {
    reply.status(401).send("Access denied - authentication not found");
    return;
  }

  // Validate the RefreshToken:
  const res = await request.pg.query(VALIDATE_REFRESH_TOKEN, [authToken]);
  if (res.rowCount === 1) {
    request.auth = res.rows[0];
    return;
  }

  // Invalidate the SessionToken:
  await request.pg.query(INVALIDATE_SESSION_TOKEN, [authToken]);
  reply.status(429).send("Access denied");
};
