describe("Refresh Token API", () => {
  beforeEach(global.reset);

  it("Should deny access without authentication", async () => {
    const fn = jest.fn();

    try {
      await global.post("/v1/token/refresh");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(401);
  });

  describe("With login", () => {
    let axiosOptions = null;
    let refreshToken = null;

    beforeEach(async () => {
      // Get a valid Identity Token:
      const login = await global.rawGet("/login/luke");
      const authCookie = login.headers["set-cookie"][0].split(";").shift();

      // Get a valid Delegation Token:
      const res = await global.get("/open/t1/app1", {
        headers: {
          Cookie: `${authCookie};`
        }
      });
      refreshToken = res.split(`"`)[1].split("=")[1];
      axiosOptions = { headers: { "x-refresh-token": refreshToken } };
    });

    it("Should refresh a valid token", async () => {
      const r1 = await global.rawPost.debug(
        "/v1/token/refresh",
        {},
        axiosOptions
      );
      // Validate basic reply:
      expect(r1.data).toHaveProperty("applicationToken");
      expect(r1.data).toHaveProperty("expires");

      // It should send the refresh token as http only cookie
      const refreshTokenCookie = r1.headers["set-cookie"].find(($) =>
        $.includes("x-refresh-token")
      );
      expect(refreshTokenCookie).toContain("HttpOnly");
      const newRefreshToken = refreshTokenCookie
        .split(";")
        .shift()
        .split("=")
        .pop();
      expect(newRefreshToken).toBeDefined();

      // Validate the Application Token structure
      const r2 = await global.jwt.verify(r1.data.applicationToken);
      expect(r2).toHaveProperty("auth/claims");
      expect(r2["auth/claims"]).toHaveProperty("x-session-token");
    });

    describe("Racing the Refresh Token", () => {
      // Make the first refresh call
      beforeEach(() => global.post("/v1/token/refresh", {}, axiosOptions));

      it("Should invalidate the Session Token", async () => {
        const fn = jest.fn();

        // Second refresh should fail
        try {
          await global.post("/v1/token/refresh", {}, axiosOptions);
        } catch (err) {
          fn(err);
        }

        // Check the proper response
        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0].response).toHaveProperty("status", 428);
        // console.log(fn.mock.calls[0][0].response.data);

        // Verify that the Family Token is invalidated
        const r1 = await global.testPost.debug("/pg/query", {
          q: `
          SELECT 
            "t1"."is_valid" AS "refresh_is_valid",
            "t2"."is_valid" AS "session_is_valid"
          FROM "login"."refresh_tokens" AS "t1"
          LEFT JOIN "login"."session_tokens" AS "t2"
          ON "t1"."session_token" = "t2"."id"
          WHERE "t1"."id" = $1
        `,
          p: [refreshToken]
        });

        // First token should be burned
        expect(r1.rows[0].refresh_is_valid).toBe(false);

        // Family token should be burned
        expect(r1.rows[0].session_is_valid).toBe(false);

        // There should be no valid refresh tokens for the session
        const r2 = await global.testPost.debug("/pg/query", {
          q: `
          SELECT * FROM "login"."refresh_tokens"
          WHERE "is_valid" = true AND "session_token" IN (
            SELECT "session_token" FROM "login"."refresh_tokens"
            WHERE "id" = $1
          )
        `,
          p: [refreshToken]
        });
        expect(r2.rowCount).toBe(0);
      });
    });
  });
});
