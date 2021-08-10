import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import models from "../../models";
import sendEmail from "../email_service";

const getAllUsers = async () => {
	await models.user.findAll();
};

const signup = async (reqEmail, reqPassword, reqFirstName, reqLastName) => {
	try {
		const { salt, hash } = setPassword(reqPassword);
		const User = await models.user.create({
			email: reqEmail,
			first_name: reqFirstName,
			last_name: reqLastName,
			salt: salt,
			hash: hash,
		});
		const { id, email } = User;
		const { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration } = await getNewTokens(id);
		return { email, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const setPassword = (password) => {
	// Creating a unique salt for a particular user
	const salt = crypto.randomBytes(16).toString("hex");
	// Hashing user's salt and password with 1000 iterations,
	const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
	return { salt, hash };
};

const getNewTokens = async (userId) => {
	try {
		const accessToken = uuidv4();
		const accessTokenExpiration = new Date();
		accessTokenExpiration.setMinutes(
			accessTokenExpiration.getMinutes() + parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MINUTES)
		);

		const refreshToken = uuidv4();
		const refreshTokenExpiration = new Date();
		refreshTokenExpiration.setHours(
			refreshTokenExpiration.getHours() + parseInt(process.env.REFRESH_TOKEN_EXPIRATION_HOURS)
		);

		await models.user.update(
			{
				access_token: accessToken,
				access_token_expiration: accessTokenExpiration,
				refresh_token: refreshToken,
				refresh_token_expiration: refreshTokenExpiration,
			},
			{ where: { id: userId } }
		);
		return { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const login = async (reqEmail, reqPassword) => {
	try {
		const { id, email, confirmed } = await isValidPassword(reqEmail, reqPassword);
		//   if (!confirmed) throw new Error("User Not Confirmed")
		const { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration } = await getNewTokens(id);
		return { email, accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const isValidPassword = async (email, password) => {
	try {
		const user = await models.user.findOne({ where: { email: email } });
		const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`);
		return user.hash === hash ? user : false;
	} catch (err) {
		console.error(err);
		return err;
	}
};

const getUserIdFromAccessToken = async (accessToken) => {
	try {
		const user = await models.user.findOne({ where: { access_token: accessToken } });
		console.log(user);
		const now = new Date();
		return user.access_token_expiration > now ? { id: user.id } : false;
	} catch (err) {
		console.error(err);
		return err;
	}
};

const refreshTokens = async (oldRefreshToken) => {
	try {
		const user = await models.user.findOne({ where: { refresh_token: oldRefreshToken } });
		const { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration } = await getNewTokens(user.id);
		return { accessToken, accessTokenExpiration, refreshToken, refreshTokenExpiration };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const passwordResetRequest = async (email) => {
	try {
		const user = await models.user.findOne({ where: { email: email } });
		const name = user.first_name || user.email.split("@")[0];
		const passwordResetRequestId = uuidv4();
		const passwordResetRequestExpiration = new Date();
		passwordResetRequestExpiration.setMinutes(
			passwordResetRequestExpiration.getMinutes() + parseInt(process.env.PASSWORD_RESET_REQUEST_EXPIRATION_MINUTES)
		);
		await models.user.update(
			{
				password_reset_request_id: passwordResetRequestId,
				password_reset_request_expiration: passwordResetRequestExpiration,
			},
			{ where: { id: user.id } }
		);
		const sent = sendEmail({
			from: `${process.env.EMAIL_USER}`,
			to: email,
			subject: "Did someone forget their password 🤔",
			template: "forgotPassword",
			variables: {
				name: name,
				link: `${process.env.PASSWORD_RESET_REQUEST_BASE_URL}${passwordResetRequestId}`,
			},
		});
		return { emailSent: sent };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const getPasswordResetUser = async (passwordResetRequestId) => {
	try {
		const user = await models.user.findOne({ where: { password_reset_request_id: passwordResetRequestId } });
		return { email: user.email };
	} catch (err) {
		console.error(err);
		return err;
	}
};

const passwordReset = async (passwordResetRequestId, email, password) => {
	try {
		const { salt, hash } = setPassword(password);
		const user = await models.user.findOne({
			where: { email: email, password_reset_request_id: passwordResetRequestId },
		});
		const success = await models.user.update(
			{
				salt: salt,
				hash: hash,
			},
			{
				where: {
					email: email,
					password_reset_request_id: passwordResetRequestId,
				},
			}
		);
		return success ? { passwordReset: true } : { passwordReset: false };
	} catch (err) {
		console.error(err);
		return err;
	}
};

export default {
	getAllUsers,
	signup,
	login,
	getUserIdFromAccessToken,
	refreshTokens,
	passwordResetRequest,
	getPasswordResetUser,
	passwordReset,
};
