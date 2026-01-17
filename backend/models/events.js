import { DataTypes } from 'sequelize';
import db from '../configuration/database.js';

const events = db.define('events', {
    name : { type: DataTypes.STRING, allowNull: false },
    startTime : { type: DataTypes.DATE, allowNull: false },
    endTime : { type: DataTypes.DATE, allowNull: false },
});

export default events;