const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL || "https://localhost:5432/fitness-dev";

  const client = new Pool(connectionString);

module.exports = client;
