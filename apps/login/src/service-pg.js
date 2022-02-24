const { Pool } = require("pg");

const pg = ({ registerAction, registerTargets }) => {
  // Register pg's extension points into ForrestJS hooks dictionary:
  registerTargets({
    PG_READY: "pg/ready"
  });

  registerAction({
    // run before Fastify init - needed to provide `request.query`
    priority: 10,
    target: "$INIT_SERVICE",
    handler: ({ getConfig, setContext }) => {
      // Gather configuration from the APP:
      const connectionString = getConfig(
        "pg.connectionString",
        process.env.PGSTRING
      );

      // Get configuration
      const maxConnections = getConfig("pg.maxConnections", 1);
      const poolConfig = getConfig("pg.poolConfig", {});

      // Instanciate the PG pool:
      const pool = new Pool({
        ...poolConfig,
        connectionString,
        max: maxConnections
      });

      pool.on("error", (err, client) => {
        console.error("Unexpected error on idle client", err);
        process.exit(-1);
      });

      // Export the pool instance to the App Context:
      setContext("pg.pool", pool);

      // Export a straightforward query utility to the APP Context:
      const query = pool.query.bind(pool);
      setContext("pg.query", query);
    }
  });

  registerAction({
    target: "$START_SERVICE",
    handler: async ({ getContext, createExtension }) => {
      // Get a reqference to the PG pool instance:
      const pool = getContext("pg.pool");
      const query = getContext("pg.query");

      // Try to collect the server's time to prove the connection is established:
      try {
        const res = await pool.query(`SELECT now() AS "pgtime"`);
        // console.info(`Successfully connected to Postgres`);
        // console.info(`pgtime: ${res.rows[0].pgtime}`);
      } catch (err) {
        throw new Error(`Could not connect to PostgreSQL`);
      }

      // Call the hook, passing down arguments into it:
      try {
        await createExtension.serie(`$PG_READY`, { query, pool });
      } catch (err) {
        throw new Error(`PG_READY Error: ${err.message}`);
      }
    }
  });

  registerAction({
    target: "$FASTIFY_PLUGIN",
    handler: ({ decorateRequest }, { getContext }) => {
      const query = getContext("pg.query");
      decorateRequest("pg", { query });
    }
  });

  /**
   * HEALTHCHECK
   * Integrate with the TDD and Healthz preHandlers check so that
   * the app's status should await a working pool
   */

  const healthcheckHandler = async (request, reply, next) => {
    try {
      const res = await request.pg.query(`SELECT now() AS "pgtime"`);
      // console.info(`[service-pg] Healthcheck pass: ${res.rows[0].pgtime}`);
      next();
    } catch (err) {
      reply.status(412).send("Fetchq client not yet ready");
    }
  };

  registerAction({
    target: "$FASTIFY_TDD_CHECK?",
    handler: () => healthcheckHandler
  });

  registerAction({
    target: "$FASTIFY_HEALTHZ_CHECK?",
    handler: () => healthcheckHandler
  });

  /**
   * TDD
   * Integrate with the Fastify TDD API
   */
  registerAction({
    target: "$FASTIFY_TDD_ROUTE?",
    handler: ({ registerTddRoute }) => {
      const schemaFields = {
        type: "object",
        properties: {
          q: { type: "string" }
        },
        required: ["q"]
      };

      registerTddRoute({
        method: "GET",
        url: "/pg/query",
        schema: { query: schemaFields },
        handler: (request) => {
          const { q: sql } = request.query;
          return request.pg.query(sql);
        }
      });

      registerTddRoute({
        method: "POST",
        url: "/pg/query",
        schema: { body: schemaFields },
        handler: (request) => {
          const { q: sql, p: params = [] } = request.body;
          return request.pg.query(sql, params);
        }
      });
    }
  });
};

module.exports = pg;
