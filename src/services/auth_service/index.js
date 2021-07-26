import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { models } from "../../models";

const getAllUsers = async () => {
	await models.user.findAll();
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
		throw new Error();
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
		throw new Error();
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
		throw new Error();
	}
};

const isValidPassword = async (username, password) => {
	try {
		const user = await findByUsername(username);
		const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, `sha512`).toString(`hex`);
		return user.hash === hash ? user : false;
	} catch (err) {
		console.error(err);
		throw new Error();
	}
};

const findByUsername = async (username) => {
	try {
		const user = await models.user.findOne({
			where: { username },
		});
		return user;
	} catch (err) {
		console.error(err);
		throw new Error();
	}
};

const findByAccessToken = async (accessToken) => {
	try {
		const user = await models.user.findOne({
			where: { access_token : accessToken },
		});
		return user;
	} catch (err) {
		console.error(err);
		throw new Error();
	}
};

const isAccessTokenValid = async ( accessToken ) => {
    try {
		const user = await findByAccessToken(accessToken)
        const now = new Date();
        return user.access_token_expiry > now ? true : false
    } catch (err) {
		console.error(err);
		throw new Error();
	}
}

export default { getAllUsers, signup, login, isAccessTokenValid};
