import { Sequelize } from "sequelize";
// const { applyExtraSetup } = require('./extra-setup');

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "sqlite_db/auth.sqlite",
	logQueryParameters: true,
	benchmark: true,
});

const modelDefiners = [require("./user")];

// We define all models according to their files.
for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
// applyExtraSetup(sequelize);

// We export the sequelize connection instance to be used around our app.
module.exports = sequelize;
