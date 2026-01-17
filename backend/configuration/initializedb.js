import user from '../models/user.js';
import events from '../models/events.js';
import attendance from '../models/attendance.js';
import eventgroup from '../models/eventsgroup.js';
import accesscode from '../models/accesscode.js';

async function intializeDB() {

    user.hasMany(eventgroup, { foreignKey: 'eoId' });
    eventgroup.belongsTo(user, { foreignKey: 'eoId' });

    eventgroup.hasMany(events, { foreignKey: 'groupId' });
    events.belongsTo(eventgroup, { foreignKey: 'groupId' });

    user.hasMany(events, { foreignKey: 'eoId' });
    events.belongsTo(user, { foreignKey: 'eoId' });    

    events.hasMany(attendance, { foreignKey: 'eventId' });
    attendance.belongsTo(events, { foreignKey: 'eventId' });

    user.hasMany(attendance, { foreignKey: 'participantId' });
    attendance.belongsTo(user, { foreignKey: 'participantId' });

    events.hasMany(accesscode, { foreignKey: 'eventId' });
    accesscode.belongsTo(events, { foreignKey: 'eventId' });

}

export default intializeDB;