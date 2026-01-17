import { Sequelize } from 'sequelize';

const db = new Sequelize({
  dialect: 'sqlite',
  storage: './database2.db'
});

const syncDatabase = async () => {
    try {
        await db.sync({force: false});
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
};

syncDatabase();

export default db;
