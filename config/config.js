module.exports = {
  development: {
    username: 'akira',
    password: null,
    database: 'aecom_development',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: "HELLO",
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: { // https://github.com/sequelize/sequelize/issues/12083
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
