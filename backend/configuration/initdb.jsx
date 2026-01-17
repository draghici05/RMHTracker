import db from './database.jsx';   
import intializeDB from './initializedb.jsx';

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