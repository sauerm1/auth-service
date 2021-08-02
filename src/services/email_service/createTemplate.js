const createHTMLTemplate = (template, variables) => {
	const keys = Object.keys(variables);
	console.log(keys);
	let html = template;
	console.log(typeof template);
	keys.forEach((k) => {
		console.log(variables[k]);
		html = html.replace(`{{${k}}}`, variables[k]);
	});
    console.log(html)
	return html;
};

export default createHTMLTemplate;
