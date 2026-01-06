import db from './database.jsx';

initializeDatabase();

(async () => {
    try {
        await db.sync({ force: true });
        console.log("Database reset");
    } catch (error) {
        console.warn(error.stack);
    }
})();
