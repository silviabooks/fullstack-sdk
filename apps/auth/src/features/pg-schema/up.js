module.exports = (pg) =>
  pg.query(`
    BEGIN;

    CREATE SCHEMA IF NOT EXISTS "public";
    CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA "public";

    CREATE TABLE IF NOT EXISTS "public"."users" (
      "uname" TEXT NOT NULL PRIMARY KEY
    );

    CREATE TABLE IF NOT EXISTS "public"."tenants" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant" )
    );

    CREATE TABLE IF NOT EXISTS "public"."catalog" (
      "user" TEXT NOT NULL,
      "tenant" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      PRIMARY KEY ( "user", "tenant", "name" )
    );

    CREATE TABLE IF NOT EXISTS "public"."apps" (
      "name" TEXT NOT NULL,
      "url" TEXT NOT NULL,
      PRIMARY KEY ( "name" )
    );

    CREATE TABLE IF NOT EXISTS "public"."identity_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "user" TEXT NOT NULL,
      "is_valid" BOOL NOT NULL DEFAULT true,
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "public"."session_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "identity_token" uuid NOT NULL,
      "claims" JSON NOT NULL DEFAULT '{}',
      "is_valid" BOOL DEFAULT true,
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      PRIMARY KEY ("id")
    );

    CREATE TABLE IF NOT EXISTS "public"."refresh_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "session_token" uuid NOT NULL,
      "is_valid" BOOL DEFAULT true NOT NULL,
      "expires_at" timestamptz NOT NULL DEFAULT NOW() + INTERVAL '100y',
      "created_at" timestamptz NOT NULL DEFAULT NOW(),
      PRIMARY KEY ("id")
    );

    COMMIT;
`);
