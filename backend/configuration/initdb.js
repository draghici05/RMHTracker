import db from './database.js';   
import intializeDB from './initializedb.js';

intializeDB();

(async () => {
    try {
        await db.sync({force: false});
        console.log("Database initialized");
    } catch (error) {
        console.warn(error.stack);
    }
})();

// for aws