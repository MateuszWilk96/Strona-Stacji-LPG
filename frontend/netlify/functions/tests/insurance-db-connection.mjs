import pg from "pg";

const connectionString = process.env.INSURANCE_DATABASE_URL;

if (!connectionString) {
  throw new Error("Brak INSURANCE_DATABASE_URL");
}

const client = new pg.Client({
  connectionString,
  connectionTimeoutMillis: 8000,
});

try {
  await client.connect();

  const result = await client.query(`
    SELECT
      current_user AS db_user,
      has_schema_privilege(
        current_user,
        'insurance_private',
        'USAGE'
      ) AS schema_access
  `);

  const { db_user, schema_access } = result.rows[0];

  if (db_user !== "insurance_writer" || schema_access !== true) {
    throw new Error("Nieprawidłowe konto lub uprawnienia bazy.");
  }

  console.log("TEST OK — połączenie z ograniczonym kontem działa.");
} finally {
  await client.end();
}
