INSERT INTO "countries" ("id", "name")
VALUES
  ('it',	'Italy'),
  ('se',	'Sweden'),
  ('dk',	'Denmark'),
  ('uk',	'United Kingdom')
ON CONFLICT ON CONSTRAINT "countries_pkey" DO NOTHING;

INSERT INTO "users" ("id", "name", "country_id", "last_login", "created_at") 
VALUES
  ('8973c56c-6260-48cb-9c5d-341f22c73ba0',	'luke',	'uk',	NULL,	'2022-02-11 16:48:46.764283+00'),
  ('9258968b-2824-4517-80b3-59925a98a23f',	'marco',	'it',	NULL,	'2022-02-11 16:48:56.089694+00'),
  ('88f25e2e-52b0-472f-83ef-9f47b6e04805',	'sven',	'se',	NULL,	'2022-02-11 16:49:01.459124+00')
ON CONFLICT ON CONSTRAINT "users_pkey" DO NOTHING;