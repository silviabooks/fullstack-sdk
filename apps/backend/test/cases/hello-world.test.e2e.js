describe("Hello World", () => {
  it("should workd", async () => {
    const res = await global.post("/hello-world", {
      input: {
        name: "marco"
      }
    });

    expect(res).toHaveProperty("message", "hello marco");
  });
});
