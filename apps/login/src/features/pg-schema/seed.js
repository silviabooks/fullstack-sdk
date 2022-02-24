module.exports = (pg) =>
  pg.query(`
    BEGIN;

    INSERT INTO "app_login"."users"
      ("uname") VALUES
      ('luke')
    , ('ian')
    , ('leia')
    ON CONFLICT ON CONSTRAINT "users_pkey" DO NOTHING;

    INSERT INTO "app_login"."tenants"
      ("user", "tenant") VALUES
      ('luke', 't1')
    , ('luke', 't2')
    , ('ian', 't3')
    ON CONFLICT ON CONSTRAINT "tenants_pkey" DO NOTHING;

    INSERT INTO "app_login"."catalog"
      ("user", "tenant", "name") VALUES
      ('luke', 't1', 'app1')
    , ('luke', 't1', 'app2')
    , ('ian', 't3', 'app1')
    ON CONFLICT ON CONSTRAINT "catalog_pkey" DO NOTHING;

    INSERT INTO "app_login"."apps"
      ("name", "url") VALUES
      ('app1', 'http://localhost:3000')
    , ('app2', 'http://localhost:3002')
    ON CONFLICT ON CONSTRAINT "apps_pkey" DO NOTHING;

    COMMIT;
`);
