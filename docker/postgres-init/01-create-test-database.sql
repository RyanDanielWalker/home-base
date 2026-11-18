-- Runs once, the first time the Postgres container starts with an empty
-- volume. The official Postgres image runs every file in
-- /docker-entrypoint-initdb.d in name order, after creating POSTGRES_DB.
--
-- home_base is for development. home_base_test is for the database tests,
-- which empty it between tests, so they never touch development data
-- (docs/adr/0032-test-with-vitest-against-a-local-test-database.md).
CREATE DATABASE home_base_test;
