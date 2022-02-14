module.exports = (pg) => pg.query('DROP SCHEMA IF EXISTS "public" CASCADE;');
