module.exports = {
  up: async (queryInterface) => {
    // Define category data
    const users = [
      {
        name: 'tim',
        password: '12345',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'tam',
        password: '12345',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    queryInterface.bulkInsert('users', users);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null);
  },
};
