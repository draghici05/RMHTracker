import db from './database.jsx';
import initializeDB from './initializedb.jsx'

initializeDB();

(async () => {
    try {
        await db.sync({ force: true });
        console.log("Database reset");
    } catch (error) {
        console.warn(error.stack);
    }
})();
