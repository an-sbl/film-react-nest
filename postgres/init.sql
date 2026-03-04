DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'prac') THEN
      CREATE ROLE prac WITH LOGIN PASSWORD 'prac' CREATEDB;
   END IF;
END
$do$;

-- Создаем базу данных prac, если не существует
SELECT 'CREATE DATABASE prac OWNER prac'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'prac')\gexec

-- Даем права
GRANT ALL PRIVILEGES ON DATABASE prac TO prac;