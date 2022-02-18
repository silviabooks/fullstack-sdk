describe("Fix Users Full Name", () => {
  it("should workd", async () => {
    const res = await global.post("/fix-users-full-name", {
      event: {
        session_variables: {
          "x-hasura-role": "admin"
        },
        op: "UPDATE",
        data: {
          old: {
            country_id: "uk",
            full_name: null,
            name: "luke",
            created_at: "2022-02-11T16:48:46.764283+00:00",
            id: "8973c56c-6260-48cb-9c5d-341f22c73ba0",
            last_login: "2020-12-14T00:00:00+00:00"
          },
          new: {
            country_id: "uk",
            full_name: null,
            name: "luke",
            created_at: "2022-02-11T16:48:46.764283+00:00",
            id: "8973c56c-6260-48cb-9c5d-341f22c73ba0",
            last_login: "2020-12-15T00:00:00+00:00"
          }
        },
        trace_context: {
          trace_id: "612dfd5912bea5fe",
          span_id: "140e704d00112c3d"
        }
      },
      created_at: "2022-02-17T16:35:21.71273Z",
      id: "3a7a1f95-a067-4c6c-a224-291e02c5472b",
      delivery_info: {
        max_retries: 0,
        current_retry: 0
      },
      trigger: {
        name: "fix_user_fullname"
      },
      table: {
        schema: "public",
        name: "users"
      }
    });

    expect(res).toBe("ok");
  });
});
