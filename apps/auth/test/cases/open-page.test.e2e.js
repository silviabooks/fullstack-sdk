describe("Open Page", () => {
  beforeAll(global.reset);

  it("Should deny access without authentication", async () => {
    const fn = jest.fn();

    try {
      await global.get("/open/t1/app1");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(401);
  });

  describe("with login", () => {
    let axiosOptions = null;
    beforeAll(async () => {
      const login = await global.rawGet("/login/luke", {
        withCredentials: true
      });
      const authCookie = login.headers["set-cookie"][0].split(";").shift();
      axiosOptions = {
        headers: {
          Cookie: `${authCookie};`
        }
      };
    });

    it("Should generate a refresh token", async () => {
      const res = await global.get("/open/t1/app1", axiosOptions);
      expect(res).toContain("?token=");
    });
  });
});
