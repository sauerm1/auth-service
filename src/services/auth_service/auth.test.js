import auth from ".";

test("signup user", async () => {
	const response = await auth.signup("mark", "password");
	expect(response).toBeTruthy();
});

test("login user", async () => {
	const response = await auth.login("mark", "password");
	expect(response).toBeTruthy();
});

