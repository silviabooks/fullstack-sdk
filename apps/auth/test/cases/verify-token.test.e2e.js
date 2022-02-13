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

    it("Should validate a Refresh Token", async () => {
      const res = await global.post("/v1/token/verify", {}, axiosOptions);
      expect(res).toHaveProperty("expires");
    });
  });
});
