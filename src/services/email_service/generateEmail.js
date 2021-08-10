const generateEmail = (template, variables) => {
	const keys = Object.keys(variables);
	let html = template;
	keys.forEach((k) => {
		html = html.replace(`{{${k}}}`, variables[k]);
	});
	return html;
};

export default generateEmail;
