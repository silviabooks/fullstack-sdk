describe("Tenants Page", () => {
  beforeAll(global.reset);

  it("Should deny access without authentication", async () => {
    const fn = jest.fn();

    try {
      await global.get("/tenants");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(401);
  });

  it("Should provide a list of tenants for the correct user", async () => {
    const login = await global.rawGet("/login/luke", { withCredentials: true });
    const authCookie = login.headers["set-cookie"][0].split(";").shift();

    const res = await global.get("/tenants", {
      headers: {
        Cookie: `${authCookie};`
      }
    });

    expect(res).toContain("t1");
    expect(res).toContain("t2");
  });
});
