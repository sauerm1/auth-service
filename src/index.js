import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes";
import db from './db'

const app = express();

// Third-Party Middleware

app.use(cors());

// Built-In Middleware
// app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sync({ force: true }).then(async () => {
  console.log("synced DB")
  return;
})

app.use("/api/v1/health", routes.health);
app.use("/api/v1/auth", routes.auth);

// app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.BASE_URL}:${process.env.PORT}`));
const assertDatabaseConnectionOk  = async () => {
	console.log(`Checking database connection...`);
	try {
		await db.authenticate();
		console.log('Database connection OK!');
	} catch (error) {
		console.log(`Unable to connect to the database: ${error.message}`);
		process.exit(1);
	}
}

const init = async () => {
	await assertDatabaseConnectionOk();

	console.log(`Starting auth server on port ${process.env.PORT}...`);

	app.listen(process.env.PORT, () => {
        console.log(`Listening on ${process.env.BASE_URL}:${process.env.PORT}`)	});
}

init();