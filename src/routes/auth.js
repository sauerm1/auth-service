import { Router } from "express";
import models from "../models";
import auth from "../services/auth_service";

const router = Router();

router.get("/users", async (req, res) => {
	const users = await models.user.findAll();
	res.status(200).json(users);
});

router.post("/signup", async (req, res) => {
	try {
		const { email, password, firstName, lastName } = req.body;
		const response = await auth.signup(email, password, firstName, lastName);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const response = await auth.login(email, password);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/accessToken", async (req, res) => {
	try {
		const { accessToken } = req.body;
		const response = await auth.getUserIdFromAccessToken(accessToken);
		res.status(200).json(response);
	} catch {
		res.status(500).json(err);
	}
});

router.put("/refreshToken", async (req, res) => {
	try {
		const { refreshToken } = req.body;
		const response = await auth.refreshTokens(refreshToken);
		res.status(200).json(response);
	} catch {
		res.status(500).json(err);
	}
});

router.post("/passwordReset/request", async (req, res) => {
	try {
		const { email } = req.body;
		const response = await auth.passwordResetRequest(email);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.get("/passwordReset/getUser", async (req, res) => {
	try {
		const { passwordResetRequestId } = req.body;
		const response = await auth.getPasswordResetUser(passwordResetRequestId);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/passwordReset", async (req, res) => {
	try {
		const { passwordResetRequestId, email, password } = req.body;
		const response = await auth.passwordReset(passwordResetRequestId, email, password);
		res.status(200).json(response);
	} catch (err) {
		res.status(500).json(err);
	}
});

export default router;
