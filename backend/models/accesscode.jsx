import { DataTypes } from 'sequelize';
import db from '../configuration/database.jsx';

const accesscode = db.define('accesscode', {
    code : { type: DataTypes.STRING, allowNull: false, unique: true },
    format : { type: DataTypes.STRING, allowNull: false },
});

export default accesscode;