import { DataTypes } from 'sequelize';
import db from '../configuration/database.jsx';

const eventgroup = db.define('eventsgroup', {
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
});

export default eventgroup;