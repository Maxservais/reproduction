CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

-- Add a test user
INSERT INTO users (id, name, email) VALUES (1, 'Test User', 'test@example.com');