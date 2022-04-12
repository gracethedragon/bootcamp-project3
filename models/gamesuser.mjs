export default function initGamesuserModel(sequelize, DataTypes) {
  return sequelize.define(
    'gamesuser',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      gameId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'games',
          key: 'id',
        },
      },
      playerOne: {
        type: DataTypes.STRING,

      },
      playerTwo: {
        type: DataTypes.STRING,

      },
      registeredUserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      // created_at and updated_at are required
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      // The underscored option makes Sequelize reference snake_case names in the DB.
      underscored: true,
      tableName: 'gamesusers',
    },
  );
}
