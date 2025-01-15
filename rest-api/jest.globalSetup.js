// this is the '.env' file for jest during testing
// GOOGLE_OAUTH2_CLIENT_ID is omitted here, it is mocked in the tests

process.env.DATABASE_URL = 'postgres://user:password@localhost:5432/dev_db';
