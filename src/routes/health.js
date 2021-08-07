import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/", function (req, res) {
	res.send("App Healthy");
});

router.get("/db", async (req, res) => {
	try {
		await db.authenticate();
		console.log("Connection has been established successfully.");
		res.send("DB Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
		res.send(`Unable to connect to the database: ${error}`);
	}
});

export default router;
