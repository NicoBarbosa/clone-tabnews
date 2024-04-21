import database from "infra/database.js";

async function status(request, response) {
  const databaseVersionResult = await database.query("SHOW server_version;");

  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW max_connections;");

  const maxConnectionsValue = parseInt(
    maxConnectionsResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;

  const queryConfig = {
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  };

  const openedConnectionsResult = await database.query(queryConfig);

  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  const updatedAt = new Date().toISOString();
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: maxConnectionsValue,
        opened_connections: openedConnectionsValue,
      },
    },
  });
}

export default status;
