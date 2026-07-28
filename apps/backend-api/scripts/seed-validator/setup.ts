process.env.SKIP_SEED_DB = 'true';
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
}
if (!process.env.REDIS_URL) {
  process.env.REDIS_URL = 'redis://localhost:6379';
}
if (!process.env.JWT_ACCESS_SECRET) {
  process.env.JWT_ACCESS_SECRET = 'dummy_jwt_access_secret_long_enough_32_chars';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'dummy_jwt_refresh_secret_long_enough_32_chars';
}
if (!process.env.AUTH_SHARED_SECRET) {
  process.env.AUTH_SHARED_SECRET = 'dummy_auth_shared_secret_16_chars';
}
