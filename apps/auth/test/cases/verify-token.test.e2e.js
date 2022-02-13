describe("Verify Token", () => {
  it("Should deny access without authentication", async () => {
    const fn = jest.fn();

    try {
      await global.post("/v1/token/verify");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(401);
  });

  describe("with login", () => {
    let identityToken = null;
    let axiosOptions = null;

    beforeEach(async () => {
      // Get a valid Identity Token:
      const login = await global.rawGet("/login/luke");
      identityToken = login.headers["set-cookie"][0]
        .split(";")
        .shift()
        .split("=")
        .pop();

      // Get a valid Delegation Token:
      const res = await global.get("/open/t1/app1", {
        headers: {
          Cookie: `auth=${identityToken};`
        }
      });
      const token = res.split(`"`)[1].split("=")[1];
      axiosOptions = { headers: { "x-auth-id": token } };
    });

    it("Should validate a Refresh Token", async () => {
      const res = await global.post("/v1/token/verify", {}, axiosOptions);
      expect(res).toHaveProperty("expires");
    });

    it("Should invalidate a Refresh Token if the related Identity Token gets invalidated", async () => {
      const fn = jest.fn();

      // Invalidate the Identity Token
      await global.testPost("/pg/query", {
        q: `
          UPDATE "public"."identity_tokens" 
             SET "is_valid" = false 
           WHERE "id" = $1`,
        p: [identityToken]
      });

      try {
        await global.post("/v1/token/verify", {}, axiosOptions);
      } catch (err) {
        fn(err);
      }

      expect(fn.mock.calls.length).toBe(1);
    });

    it("Should invalidate a Refresh Token if the related Identity Token expires", async () => {
      const fn = jest.fn();

      // Expire the Identity Token
      await global.testPost("/pg/query", {
        q: `
          UPDATE "public"."identity_tokens" 
             SET "expires_at" = NOW() - INTERVAL '1s'
           WHERE "id" = $1`,
        p: [identityToken]
      });

      try {
        await global.post("/v1/token/verify", {}, axiosOptions);
      } catch (err) {
        fn(err);
      }

      expect(fn.mock.calls.length).toBe(1);
    });
  });
});
