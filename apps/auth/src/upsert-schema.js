const down = async (pg) => {
  await pg.query('DROP SCHEMA IF EXISTS "public" CASCADE');
};

const up = async (pg) => {
  await pg.query(`CREATE SCHEMA "public";`);

  // USERS
  await pg.query(`
    CREATE TABLE "public"."users" (
      "uname" TEXT NOT NULL PRIMARY KEY
    )
  `);
  await pg.query(`
    INSERT INTO "public"."users"
      ("uname") VALUES
      ('luke')
    , ('ian')
    , ('leia')
  `);

  // TENANTS
  await pg.query(`
    CREATE TABLE "public"."tenants" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant" )
    )
  `);
  await pg.query(`
    INSERT INTO "public"."tenants"
      ("user", "tenant") VALUES
      ('luke', 't1')
    , ('luke', 't2')
    , ('ian', 't3')
  `);

  // CATALOG
  await pg.query(`
    CREATE TABLE "public"."catalog" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant", "name" )
    )
  `);
  await pg.query(`
    INSERT INTO "public"."catalog"
      ("user", "tenant", "name") VALUES
      ('luke', 't1', 'app1')
    , ('luke', 't1', 'app2')
    , ('ian', 't3', 'app1')
  `);

  // APPS
  await pg.query(`
    CREATE TABLE "public"."apps" (
      "name" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      PRIMARY KEY ( "name" )
    )
  `);
  await pg.query(`
    INSERT INTO "public"."apps"
      ("name", "url") VALUES
      ('app1', 'http://localhost:3000')
    , ('app2', 'http://localhost:3002')
  `);

  // AUTH DELEGATION
  await pg.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  await pg.query(`
    CREATE TABLE "public"."session_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
      "is_valid" BOOL DEFAULT true,
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      "app" TEXT NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      PRIMARY KEY ("id")
    );
  `);
  await pg.query(`
    CREATE TABLE "public"."refresh_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(), 
      "session_token" uuid NOT NULL,
      "was_used" BOOL DEFAULT false NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      PRIMARY KEY ("id")
    );
  `);
};

module.exports = {
  name: "upsertSchema",
  target: "$PG_READY",
  handler: async (pg) => {
    try {
      await down(pg);
      console.log("[upsertSchema] Down migration applied.");
    } catch (err) {
      console.warn(
        `[upsertSchema] Could not apply down migration: ${err.message}`
      );
    }

    try {
      await up(pg);
      console.log("[upsertSchema] Up migration applied.");
    } catch (err) {
      console.warn(
        `[upsertSchema] Could not apply up migration: ${err.message}`
      );
    }
  }
};
