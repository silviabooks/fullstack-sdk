module.exports = async (pg) => {
  await pg.query(`CREATE SCHEMA IF NOT EXISTS "public";`);
  await pg.query(
    `CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA "public";`
  );

  // USERS
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."users" (
      "uname" TEXT NOT NULL PRIMARY KEY
    )
  `);
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."identity_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "user" TEXT NOT NULL,
      "is_valid" BOOL NOT NULL DEFAULT true,
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      PRIMARY KEY ("id")
    )
  `);

  // TENANTS
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."tenants" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant" )
    )
  `);

  // CATALOG
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."catalog" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant", "name" )
    )
  `);

  // APPS
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."apps" (
      "name" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      PRIMARY KEY ( "name" )
    )
  `);

  // AUTH DELEGATION
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."session_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "identity_token" uuid NOT NULL,
      "is_valid" BOOL DEFAULT true,
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      "claims" JSON NOT NULL DEFAULT '{}',
      PRIMARY KEY ("id")
    );
  `);
  await pg.query(`
    CREATE TABLE IF NOT EXISTS "public"."refresh_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "session_token" uuid NOT NULL,
      "was_used" BOOL DEFAULT false NOT NULL,
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      PRIMARY KEY ("id")
    );
  `);
};
