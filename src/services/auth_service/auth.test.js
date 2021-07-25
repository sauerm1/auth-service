import auth from '.'

test('signup user', () => {
    expect(auth.signup("mark", "password")).toBeTruthy();
  });