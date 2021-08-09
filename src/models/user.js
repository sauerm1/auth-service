const { DataTypes } = require("sequelize");
import sequelize from "../db";

const user = sequelize.define("user", {
	id: {
		allowNull: false,
		autoIncrement: true,
		primaryKey: true,
		type: DataTypes.INTEGER,
	},
	email: {
		allowNull: false,
		type: DataTypes.STRING,
		unique: true,
		validate: {
			is: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
		},
	},
	first_name: { type: DataTypes.STRING },
	last_name: { type: DataTypes.STRING },
	hash: { type: DataTypes.STRING },
	salt: { type: DataTypes.STRING },
	access_token: { type: DataTypes.STRING },
	access_token_expiration: { type: DataTypes.DATE },
	refresh_token: { type: DataTypes.STRING },
	refresh_token_expiration: { type: DataTypes.DATE },
	confirmed: { type: DataTypes.BOOLEAN, defaultValue: 0 },
	password_reset_request_id: { type: DataTypes.STRING },
	password_reset_request_expiration: { type: DataTypes.DATE },
});

export default user;
