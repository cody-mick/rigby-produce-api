import { useEffect, useState } from "react";

const TestingData = () => {
	const [data, setData] = useState([]);

	useEffect(() => {
		async function fetchData() {
			await fetch("/.netlify/functions/get-docksides")
				.then((res) => res.json())
				.then((data) => setData(data));
		}
		fetchData();
	}, []);

	return (
		<div>
			{data.map((docksides: any) => (
				<p>{docksides.cellar}</p>
			))}
		</div>
	);
};

export default TestingData;
