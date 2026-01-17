import { DataTypes } from 'sequelize';
import db from '../configuration/database.jsx';

const attendance = db.define('attendance', {
    confirmedAt : { type: DataTypes.DATE, allowNull: false },
    method: { type: DataTypes.STRING, allowNull: false },
});

export default attendance;