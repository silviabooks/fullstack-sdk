module.exports = async (request, reply) => {
  const users = await request.pg.query('SELECT * FROM "login"."users"');

  const loginLinks = users.rows.map(
    (user) => `
    <li>
      <a href="/login/${user.uname}">${user.uname}</a>
    </li>
  `
  );

  reply.type("text/html").send(`
    <h1>Login As:</h1>
    ${loginLinks.join("")}
  `);
};
