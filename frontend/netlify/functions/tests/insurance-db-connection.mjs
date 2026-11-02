
import pg from "pg";

const connectionString = process.env.INSURANCE_DATABASE_URL;

if (!connectionString) {
  console.error("TEST FAILED — brak konfiguracji bazy.");
  process.exitCode = 1;
} else {
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
      throw new Error("Nieprawidłowe uprawnienia");
    }

    console.log("TEST OK — połączenie z ograniczonym kontem działa.");
  } catch {
    console.error("TEST FAILED — połączenie lub weryfikacja uprawnień nie powiodły się.");
    process.exitCode = 1;
  } finally {
    try {
      await client.end();
    } catch {
      console.error("TEST FAILED — błąd zamykania połączenia.");
      process.exitCode = 1;
    }
  }
}
