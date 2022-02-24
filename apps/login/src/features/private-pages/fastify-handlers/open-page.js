const GET_SESSION_CLAIMS = `SELECT * FROM get_session_claims($1, $2, $3)`;
const GET_REFRESH_TOKEN = `SELECT * FROM build_session_token($1, $2, $3)`;

module.exports = async (request, reply) => {
  const { id: identityToken, uname } = request.auth;
  const { tenant, app } = request.params;

  // Get the App's URL:
  const r1 = await request.pg.query(GET_SESSION_CLAIMS, [uname, tenant, app]);
  if (r1.rowCount === 0 || r1.rows[0].app_info === null) {
    reply.status(404).send("App not found");
    return;
  }

  // Build the Refresh Token:
  // NOTE: this first Refresh Token is intended for immediate utilization
  //       from the target App as it will be passed down via URI parameter
  //       and it is particularly sensible to leakage.
  //       It takes the name of DELEGATION TOKEN
  try {
    const r2 = await request.pg.query(GET_REFRESH_TOKEN, [
      identityToken,
      JSON.stringify({
        uname,
        tenant: r1.rows[0].tenants,
        app: r1.rows[0].apps
      }),
      "1m"
    ]);

    // Get data for the template:
    const { url } = r1.rows[0];
    const token = r2.rows[0].delegate_token;

    reply.type("text/html").send(`
    <script>window.location = "${url}?token=${token}"</script>
  `);
  } catch (err) {
    console.log(err.message);
    console.log(err);
    throw err;
  }
};
