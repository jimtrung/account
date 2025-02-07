-- Improved users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE CHECK (LENGTH(username) >= 3),
    password VARCHAR(255) NOT NULL CHECK (LENGTH(password) >= 10), 
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    phone_number VARCHAR(20) DEFAULT 'no_phone_number',
    country VARCHAR(100) DEFAULT 'global', 
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL, 
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_username_email UNIQUE (username, email) 
);

-- Drop table users
DROP TABLE users;

SELECT * FROM users;