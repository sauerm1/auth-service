import { Router } from "express";
import { models } from "../models";
import auth from "../services/auth_service";

const router = Router();

router.get("/users", async (req, res) => {
	const users = await models.user.findAll();
	res.status(200).json(users);
});

router.post("/signup", async (req, res) => {
	try {
		const { username, password } = req.body;
		const response = await auth.signup(username, password);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const response = await auth.login(username, password);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/accesstoken", async (req, res) => {
    try {
        const { accessToken } = req.body
        const response = await auth.isAccessTokenValid(accessToken)
        res.status(200).json(response);
    } catch {
        res.status(500).json(err);
    }
})

router.put("/refreshtoken", async (req, res) => {
    try {
        const { refreshToken } = req.body
        const response = await auth.refreshTokens(refreshToken)
        res.status(200).json(response);
    } catch {
        res.status(500).json(err);
    }
})

export default router;
