describe("Catalog Page", () => {
  it("Should deny access without authentication", async () => {
    const fn = jest.fn();

    try {
      await global.get("/tenants/t1");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(401);
  });

  describe("with login", () => {
    let axiosOptions = null;
    beforeEach(async () => {
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

    it("Should return 404 for a non existing tenant", async () => {
      const fn = jest.fn();

      try {
        await global.get("/tenants/foobar", axiosOptions);
      } catch (err) {
        fn(err);
      }

      expect(fn.mock.calls.length).toBe(1);
      expect(fn.mock.calls[0][0].response.status).toBe(404);
    });
  });

  // it("Should provide a list of tenants for the correct user", async () => {
  //   const login = await global.rawGet("/login/luke", { withCredentials: true });
  //   const authCookie = login.headers["set-cookie"][0].split(";").shift();

  // const res = await global.get("/tenants", );

  //   expect(res).toContain("t1");
  //   expect(res).toContain("t2");
  // });
});
