const formatTimeString = (time: string) => {
	const parts = time.split(":");
	if (parts.length === 3) {
		const hours = parts[0];
		const minutes = parts[1];
		const amPm = parts[2].split(" ")[1];
		const formattedTime = `${hours}:${minutes} ${amPm}`;
		return formattedTime;
	} else {
		return time;
	}
};

export default formatTimeString;
