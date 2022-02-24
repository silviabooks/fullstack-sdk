const GET_TENANTS = `SELECT "tenant" FROM "login"."tenants" WHERE "user" = $1`;

module.exports = async (request, reply) => {
  const res = await request.pg.query(GET_TENANTS, [request.auth.uname]);

  const tenantsList = res.rows.map(
    (item) => `<li><a href="/tenants/${item.tenant}">${item.tenant}</a></li>`
  );

  reply.type("text/html").send(`
    <h1>Tenants</h1>
    <ul>${tenantsList.join("")}</ul>
    <hr />
    <a href="/logout">Logout</a>
  `);
};
