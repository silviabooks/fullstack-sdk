module.exports = async (pg) => {
  await pg.query('DROP SCHEMA IF EXISTS "public" CASCADE');
};
