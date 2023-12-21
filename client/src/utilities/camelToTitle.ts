export default function camelToTitle(text: string) {
	let result = "";
	let prevChar = "";

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		if (
			char.toUpperCase() === char &&
			prevChar.toLowerCase() === prevChar
		) {
			result += " " + char;
		} else {
			result += char;
		}

		prevChar = char;
	}

	result = result.charAt(0).toUpperCase() + result.slice(1);

	return result;
}
