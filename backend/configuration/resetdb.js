import db from './database.js';
import initializeDB from './initializedb.js'

initializeDB();

(async () => {
    try {
        await db.sync({ force: true });
        console.log("Database reset");
    } catch (error) {
        console.warn(error.stack);
    }
})();
