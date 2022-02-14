describe("Refresh Token", () => {
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

  describe("with login", () => {
    let axiosOptions = null;

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
      const token = res.split(`"`)[1].split("=")[1];
      axiosOptions = { headers: { "x-auth-id": token } };
    });

    it("Should refresh a valid token", async () => {
      const r1 = await global.post("/v1/token/refresh", {}, axiosOptions);

      // Validate basic reply:
      expect(r1).toHaveProperty("refreshToken");
      expect(r1).toHaveProperty("sessionToken");
      expect(r1).toHaveProperty("applicationToken");
      expect(r1).toHaveProperty("expires");

      // Validate the Application Token structure
      const r2 = await global.jwt.verify(r1.applicationToken);
      expect(r2).toHaveProperty("auth/claims");
      expect(r2["auth/claims"]).toHaveProperty("x-session-token");
    });

    it("Should invalidate the Family Token when using a burned out token", async () => {
      const fn = jest.fn();

      // First refresh should work
      await global.post("/v1/token/refresh", {}, axiosOptions);
      // console.log(res);

      // Second refresh should fail
      try {
        await global.post("/v1/token/refresh", {}, axiosOptions);
      } catch (err) {
        fn(err);
      }

      // Check the proper response
      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls[0][0].response).toHaveProperty("status", 429);
      // console.log(fn.mock.calls[0][0].response.data);

      // Verify that the Family Token is invalidated
      const res = await global.testPost.debug("/pg/query", {
        q: `
          SELECT 
            "t2"."id",
            "t2"."is_valid",
            "t1"."was_used"
          FROM "public"."refresh_tokens" AS "t1"
          LEFT JOIN "public"."session_tokens" AS "t2"
          ON "t1"."session_token" = "t2"."id"
          WHERE "t1"."id" = $1
        `,
        p: [axiosOptions.headers["x-auth-id"]]
      });

      // First token should be burned
      expect(res.rows[0].was_used).toBe(true);

      // Family token should be burned
      expect(res.rows[0].is_valid).toBe(false);
    });
  });
});
