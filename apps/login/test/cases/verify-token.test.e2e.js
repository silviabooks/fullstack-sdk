describe("Verify Token", () => {
  beforeAll(global.reset);

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

  describe("With login", () => {
    let identityToken = null;
    let refreshToken = null;
    let axiosOptions = null;

    beforeAll(async () => {
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
          Cookie: `x-identity-token=${identityToken};`
        }
      });
      refreshToken = res.split(`"`)[1].split("=")[1];
      axiosOptions = { headers: { "x-refresh-token": refreshToken } };
    });

    it("Should verify a valid Refresh Token sent over headers", async () => {
      const res = await global.post("/v1/token/verify", {}, axiosOptions);
      expect(res).toHaveProperty("expires");
    });

    it("Should verify a valid Refresh Token sent over a cookie", async () => {
      const res = await global.post(
        "/v1/token/verify",
        {},
        {
          headers: {
            Cookie: `x-refresh-token=${refreshToken};`
          }
        }
      );
      expect(res).toHaveProperty("expires");
    });

    describe("Invalid Refresh Token", () => {
      it("Should fail when invalid", async () => {
        const fn = jest.fn();

        // Invalidate the Session Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."refresh_tokens" 
             SET "is_valid" = false 
           WHERE "id" = $1`,
          p: [refreshToken]
        });

        try {
          await global.post("/v1/token/verify", {}, axiosOptions);
        } catch (err) {
          fn(err);
        }

        expect(fn.mock.calls.length).toBe(1);
      });

      it("Should fail when expired", async () => {
        const fn = jest.fn();

        // Expire the Identity Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."refresh_tokens" 
             SET "expires_at" = NOW() - INTERVAL '1s'
           WHERE "id" = $1`,
          p: [refreshToken]
        });

        try {
          await global.post("/v1/token/verify", {}, axiosOptions);
        } catch (err) {
          fn(err);
        }

        expect(fn.mock.calls.length).toBe(1);
      });
    });

    describe("Invalid Session Token", () => {
      it("Should fail when invalid", async () => {
        const fn = jest.fn();

        // Invalidate the Session Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."session_tokens" 
             SET "is_valid" = false 
           WHERE "identity_token" = $1`,
          p: [identityToken]
        });

        try {
          await global.post("/v1/token/verify", {}, axiosOptions);
        } catch (err) {
          fn(err);
        }

        expect(fn.mock.calls.length).toBe(1);
      });

      it("Should fail when expired", async () => {
        const fn = jest.fn();

        // Expire the Identity Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."session_tokens" 
             SET "expires_at" = NOW() - INTERVAL '1s'
           WHERE "identity_token" = $1`,
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

    describe("Invalid Identity Token", () => {
      it("Should fail when invalid", async () => {
        const fn = jest.fn();

        // Invalidate the Identity Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."identity_tokens" 
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

      it("Should fail when expired", async () => {
        const fn = jest.fn();

        // Expire the Identity Token
        await global.testPost("/pg/query", {
          q: `
          UPDATE "app_login"."identity_tokens" 
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
});
