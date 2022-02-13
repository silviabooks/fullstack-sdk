module.exports = async (pg) => {
  await pg.query(`
    INSERT INTO "public"."users"
      ("uname") VALUES
      ('luke')
    , ('ian')
    , ('leia')
    ON CONFLICT ON CONSTRAINT "users_pkey" DO NOTHING
  `);
  await pg.query(`
    INSERT INTO "public"."tenants"
      ("user", "tenant") VALUES
      ('luke', 't1')
    , ('luke', 't2')
    , ('ian', 't3')
    ON CONFLICT ON CONSTRAINT "tenants_pkey" DO NOTHING
  `);
  await pg.query(`
    INSERT INTO "public"."catalog"
      ("user", "tenant", "name") VALUES
      ('luke', 't1', 'app1')
    , ('luke', 't1', 'app2')
    , ('ian', 't3', 'app1')
    ON CONFLICT ON CONSTRAINT "catalog_pkey" DO NOTHING
  `);
  await pg.query(`
    INSERT INTO "public"."apps"
      ("name", "url") VALUES
      ('app1', 'http://localhost:3000')
    , ('app2', 'http://localhost:3002')
    ON CONFLICT ON CONSTRAINT "apps_pkey" DO NOTHING
  `);
};
