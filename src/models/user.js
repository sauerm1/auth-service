const { DataTypes } = require("sequelize");
import sequelize from '../db'

const user = sequelize.define("user", {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	username: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
		validate: {
			is: /^\w{3,}$/,
		},
	},
	hash: { type: DataTypes.STRING },
	salt: { type: DataTypes.STRING },
	access_token: { type: DataTypes.STRING },
	access_token_expiry: { type: DataTypes.DATE },
	refresh_token: { type: DataTypes.STRING },
	refresh_token_expiry: { type: DataTypes.DATE },
	confirmed: { type: DataTypes.BOOLEAN, defaultValue: 0 },
});

export default user;
