CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text NOT NULL, "country_id" text NOT NULL, "last_login" timestamptz, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") , FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON UPDATE restrict ON DELETE restrict, UNIQUE ("country_id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
