import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import models from "../../models";
import sendEmail from "../email_service";

const getAllUsers = async () => {
	await models.user.findAll();
};

const findUserInDB = async (db_column, value) => {
	try {
		const user = await models.user.findOne({
			where: { [db_column]: value },
		});
		return user;
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const signup = async (reqUsername, reqPassword) => {
	try {
		const [salt, hash] = setPassword(reqPassword);
		const User = await models.user.create({
			username: reqUsername,
			salt: salt,
			hash: hash,
		});
		const { id, username } = User;
		const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await getNewTokens(id);
		return { username, accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const setPassword = (password) => {
	// Creating a unique salt for a particular user
	const salt = crypto.randomBytes(16).toString("hex");
	// Hashing user's salt and password with 1000 iterations,
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
	return [salt, hash];
};

const getNewTokens = async (userId) => {
	try {
		const ACCESS_TOKEN_EXPIRATION_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES);
		const accessToken = uuidv4();
		const accessTokenExpiry = new Date();
		accessTokenExpiry.setMinutes(accessTokenExpiry.getMinutes() + ACCESS_TOKEN_EXPIRATION_MINUTES);

		const REFRESH_TOKEN_EXPIRATION_HOURS = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_HOURS);
		const refreshToken = uuidv4();
		const refreshTokenExpiry = new Date();
		refreshTokenExpiry.setHours(refreshTokenExpiry.getHours() + REFRESH_TOKEN_EXPIRATION_HOURS);

		await models.user.update(
			{
				access_token: accessToken,
				access_token_expiry: accessTokenExpiry,
				refresh_token: refreshToken,
				refresh_token_expiry: refreshTokenExpiry,
			},
			{ where: { id: userId } }
		);
		return { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const login = async (reqUsername, reqPassword) => {
	try {
		const { id, username, confirmed } = await isValidPassword(reqUsername, reqPassword);
		//   if (!confirmed) throw new Error("User Not Confirmed")
		const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await getNewTokens(id);
		return { username, accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const isValidPassword = async (username, password) => {
	try {
		const user = await findUserInDB("username", username);
		const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`);
		return user.hash === hash ? user : false;
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const getUserIdFromAccessToken = async (accessToken) => {
	try {
		const user = await findUserInDB("access_token", accessToken);
		const now = new Date();
		return user.access_token_expiry > now ? { id: user.id } : false;
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const refreshTokens = async (oldRefreshToken) => {
	try {
		const user = await findUserInDB("refresh_token", oldRefreshToken);
		const { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry } = await getNewTokens(user.id);
		return { accessToken, accessTokenExpiry, refreshToken, refreshTokenExpiry };
	} catch (err) {
		console.error(err);
		return(err);
	}
};

const sendHelpEmail = (email) => {
	const emailResponse = sendEmail({
		from: "youremail@gmail.com",
		to: email,
		subject: "Sending Email using Node.js",
		template: "forgotPassword",
		variables: { name: "mark" },
	});
	return emailResponse;
};

export default { getAllUsers, signup, login, getUserIdFromAccessToken, refreshTokens, sendHelpEmail };
