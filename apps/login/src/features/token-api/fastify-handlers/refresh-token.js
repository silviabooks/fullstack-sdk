const REFRESH_TOKEN = `
  WITH 
    "burn_token" AS (
      UPDATE "login"."refresh_tokens"
        SET "is_valid" = false
      WHERE "id" IN (
        SELECT "id" FROM "login"."refresh_tokens"
        WHERE "id" = $1
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING "session_token" 
    ),
    "refresh_token" AS (
      INSERT INTO "login"."refresh_tokens"
      ("session_token") SELECT "session_token" FROM "burn_token"
      RETURNING "id", "session_token", "expires_at"
    )
  SELECT
    "t1"."session_token" AS "sessionToken",
    "t1"."id" AS "refreshToken",
    "t1"."expires_at" AS "expires",
    "t2"."claims" AS "claims"
  FROM "refresh_token" AS "t1"
  LEFT JOIN "login"."session_tokens" AS "t2" ON "t1"."session_token" = "t2"."id"
`;

const buildClaims = (sessionToken, expires, claims) => ({
  // Write session values first
  "x-session-token": null,
  "x-session-expires": null,
  // Add custom claims:
  ...Object.keys(claims).reduce(
    (acc, key) => ({
      ...acc,
      [`x-${key}`]: claims[key]
    }),
    {}
  ),
  // Make sure the session values are the originals:
  "x-session-token": sessionToken,
  "x-session-expires": expires
});

module.exports = async (request, reply) => {
  try {
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
    const { sessionToken, refreshToken, expires, claims } = res.rows[0];
    const applicationToken = await request.jwt.sign({
      "auth/claims": buildClaims(sessionToken, expires, claims)
    });

    reply
      .setCookie("x-refresh-token", refreshToken, {
        path: "/",
        httpOnly: true
      })
      .send({
        // refreshToken,
        applicationToken,
        expires
      });
  } catch (err) {
    console.log(err.message);
    reply.status(500).send(err.message);
  }
};

module.exports.buildClaims = buildClaims;
