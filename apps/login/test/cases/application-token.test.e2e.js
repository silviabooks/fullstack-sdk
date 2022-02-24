describe("Application Token Content", () => {
  beforeEach(global.reset);

  describe("JWT claims", () => {
    let jwtData = null;

    beforeAll(async () => {
      // Login
      const login = await global.rawGet("/login/luke", {
        withCredentials: true
      });
      const authCookie = login.headers["set-cookie"][0].split(";").shift();

      // Get a DelegationToken
      const delegationRedirect = await global.get(
        "/open/t1/app1",
        (axiosOptions = {
          headers: {
            Cookie: `${authCookie};`
          }
        })
      );
      const delegationToken = delegationRedirect.split(`"`)[1].split("=")[1];

      // Refresh the DelegationToken
      const { applicationToken } = await global.post.debug(
        "/v1/token/refresh",
        {},
        { headers: { "x-refresh-token": delegationToken } }
      );

      // Unwrap my ApplicationToken
      jwtData = await global.jwt.verify(applicationToken);
    });

    it("Should list all the users tenants", async () => {
      expect(jwtData["auth/claims"]["x-tenant"]).toEqual(
        expect.arrayContaining(["t1", "t2"])
      );
    });

    it("Should list all the users applications", async () => {
      expect(jwtData["auth/claims"]["x-app"]).toEqual(
        expect.arrayContaining(["app1", "app2"])
      );
    });
  });
});
