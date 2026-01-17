import { DataTypes } from 'sequelize';
import db from '../configuration/database.jsx';

const user = db.define('user', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role : { type: DataTypes.STRING, allowNull: false, defaultValue: 'PARTICIPANT' },
});

export default user;