const GET_APPS = `
  SELECT * FROM "login"."catalog" 
  WHERE "user" = $1 AND "tenant" = $2
`;

const makeBody = (rows, tenant) => {
  if (!rows.length) {
    return "<p>This tenant has no avaliable Apps</p>";
  }

  const appsList = rows
    .map(
      (item) => `
    <li>
      <a href="/open/${tenant}/${item.name}" target="_blank">${item.name}</a>
    </li>
  `
    )
    .join("");

  return `<ul>${appsList}</ul>`;
};

module.exports = async (request, reply) => {
  const { uname } = request.auth;
  const { tenant } = request.params;
  const res = await request.pg.query(GET_APPS, [uname, tenant]);

  reply.type("text/html").send(`
    <h2>Apps</h2>
    <a href="/tenants">back</a>
    <hr />
    ${makeBody(res.rows, tenant)}
    <hr />
    <a href="/logout">Logout</a>
  `);
};
