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

    CREATE OR REPLACE FUNCTION 
    get_session_claims(
      PAR_uname TEXT,
      PAR_tenant TEXT,
      PAR_app TEXT
    ) RETURNS TABLE (
      "url" TEXT,
      "tenants" JSON,
      "apps" JSON
    )
    AS $$
    BEGIN
      RETURN QUERY
      WITH
      -- Centralize the Query parameters:
      "params" AS (
        SELECT
          PAR_uname AS "user",
          PAR_tenant AS "tenant",
          PAR_app AS "app"
      ),
      -- Fetch data from multiple tables:
      "app_data" AS (
        SELECT "t1"."url"	AS "value"	
        FROM "public"."apps" AS "t1"
        INNER JOIN "public"."catalog" AS "t2" ON "t1"."name" = "t2"."name"
        WHERE "t1"."name" = (SELECT "app" FROM "params")
          AND "t2"."user" = (SELECT "user" FROM "params")
          AND "t2"."tenant" = (SELECT "tenant" FROM "params")
        LIMIT 1
      ),
      "tenants" AS (
        SELECT "tenant" AS "value"
        FROM "public"."tenants"
        WHERE "user" = (SELECT "user" FROM "params")
      ), 
      "apps" AS (
        SELECT "name" AS "value"
        FROM "public"."catalog"
        WHERE "user" = (SELECT "user" FROM "params")
      )
    
      -- Combine multiple result into a single JSON response:
      SELECT 
        ( SELECT "value" FROM "app_data" ) AS "url",
        (
        SELECT array_to_json(array_agg("value")) AS "tenants"
        FROM ( SELECT * FROM "tenants" ) t
        ),
        (
        SELECT array_to_json(array_agg("value")) AS "apps"
        FROM ( SELECT * FROM "apps" ) t
        );
    
    END; $$
    LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION 
    build_session_token (
      PAR_identityToken UUID,
      PAR_claims JSON,
      PAR_interval TEXT
    ) RETURNS TABLE (
      "delegate_token" UUID
    )
    AS $$
    BEGIN
      RETURN QUERY
      WITH 
        session_token AS (
          INSERT INTO "public"."session_tokens"
            ("identity_token", "claims") VALUES 
            (PAR_identityToken, PAR_claims) 
          ON CONFLICT ON CONSTRAINT "session_tokens_pkey"
          DO UPDATE SET "created_at" = EXCLUDED."created_at"
          RETURNING "id"
        ),
        refresh_token AS (
          INSERT INTO "public"."refresh_tokens"
            ("session_token", "expires_at") VALUES 
            (
              (SELECT "id" from "session_token"),
              NOW() + PAR_interval::interval
            ) 
          RETURNING "id"
        )
        SELECT "id" AS "delegate_token" FROM refresh_token;
    
    END; $$
    LANGUAGE plpgsql;

    COMMIT;
`);
