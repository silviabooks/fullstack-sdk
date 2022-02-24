const { buildClaims } = require("./refresh-token");

describe("Refresh Token", () => {
  it("Should build ApplicationToken claims", () => {
    const res = buildClaims("a", "b", {
      d: "d",
      e: 123
    });

    expect(res).toHaveProperty("x-session-token", "a");
    expect(res).toHaveProperty("x-session-expires", "b");
    expect(res).toHaveProperty("x-d", "d");
    expect(res).toHaveProperty("x-e", 123);
  });
});
