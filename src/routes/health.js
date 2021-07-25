import { Router } from "express";
import sequelize from "../models";

const router = Router();

router.get("/", function (req, res) {
	res.send("App Healthy");
});

router.get("/db", async (req, res) => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
		res.send("DB Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		res.send(`DB Unable to connect to the database: ${error}`);
	}
});

export default router;
