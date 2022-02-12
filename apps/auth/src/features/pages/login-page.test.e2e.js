describe("Login Page", () => {
  it("Should return 404 for a non existing user", async () => {
    const fn = jest.fn();

    try {
      await global.get("/login/foobar");
    } catch (err) {
      fn(err);
    }

    expect(fn.mock.calls.length).toBe(1);
    expect(fn.mock.calls[0][0].response.status).toBe(404);
  });

  it("Should release a cookie with a JWT inside", async () => {
    const res = await global.rawGet("/login/luke");
    expect(res.headers["set-cookie"].length).toBe(1);
  });
});
