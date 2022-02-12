describe("Home Page", () => {
  it("Should return a list of users for non authenticated requests", async () => {
    const res = await global.get("/");
    expect(res).toContain("luke");
  });
});
