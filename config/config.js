module.exports = {
  development: {
    username: 'akira',
    password: null,
    database: 'aecom_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true,
        rejectUnauthorized: false,
    }
  }
};
