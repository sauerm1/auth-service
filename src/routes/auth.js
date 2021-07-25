import { Router } from "express";
import { models } from "../models";
import auth from "../services/auth_service"

const router = Router();

router.get("/users", async (req, res) => {
	const users = await models.user.findAll();
	res.status(200).json(users);
});

router.post("/signup", async (req, res) => {
    const { username, password } = req.body
	const result = await auth.signup(username, password);
	res.status(200).json(result);
});

export default router;
