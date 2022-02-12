const GET_APPS = `
  SELECT * FROM "public"."catalog" 
  WHERE "user" = $1 AND "tenant" = $2
`;

module.exports = async (request, reply) => {
  const res = await request.pg.query(GET_APPS, [
    request.auth.uname,
    request.params.tenant
  ]);

  if (res.rowCount === 0) {
    reply.status(404).send("Invalid tenant");
    return;
  }

  const appsList = res.rows.map(
    (item) => `
    <li>
      <a href="/open/${request.params.tenant}/${item.name}">${item.name}</a>
    </li>
  `
  );

  reply.type("text/html").send(`<h2>Apps</h2>
    <ul>
      ${appsList.join("")}
    </ul>
    <hr />
    <a href="/logout">Logout</a>
  `);
};
