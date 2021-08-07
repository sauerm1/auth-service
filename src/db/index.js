import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "sqlite_db/auth.sqlite",
	logQueryParameters: true,
	benchmark: true,
});

export default sequelize;
