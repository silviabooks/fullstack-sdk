describe("Healthz", () => {
  it("should be able to ping the healthz", async () => {
    await global.get("/healthz");
  });
});
