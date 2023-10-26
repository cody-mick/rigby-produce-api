import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DailySummary = () => {
	const [docksides, setDocksides] = useState([]);
	const { date } = useParams();

	useEffect(() => {
		async function fetchDocksides() {
			await fetch(`http://localhost:8080/api/docksides-by-date/${date}`)
				.then((res) => res.json())
				.then((data) => setDocksides(data));
		}
		fetchDocksides();
	}, []);

	const convertToPercentage = (num: number) => {
		return (num * 100).toFixed(2);
	};

	const averages = docksides.reduce((acc: any, obj: any) => {
		const cellar = obj.cellar;
		if (!acc[cellar]) {
			acc[cellar] = {
				cellar: cellar,
				counts: 0,
				totalGrossWeight: 0,
				totalNetWeight: 0,
				defectCount: 0,
				summaryCTN: 0,
				summaryFourToEightOz: 0,
				summaryGreen: 0,
				summaryHH: 0,
				summaryOnes: 0,
				summaryProcess: 0,
				summaryTare: 0,
				totalFourToEightOz: 0,
				totalOverEightOz: 0,
			};
		}

		acc[cellar].counts++;
		acc[cellar].variety = obj.variety;
		acc[cellar].totalGrossWeight += obj.netCalcs.grossWeight;
		acc[cellar].totalNetWeight += obj.netCalcs.netWeight;
		acc[cellar].defectCount += obj.defectCount;
		acc[cellar].summaryCTN +=
			obj.netCalcs.overEightOz /
			(obj.netCalcs.fourToEightOz + obj.netCalcs.overEightOz);
		acc[cellar].summaryFourToEightOz += obj.netCalcs.fourToEightOz;
		acc[cellar].summaryGreen += obj.netCalcs.green;
		acc[cellar].summaryHH +=
			obj.defects.hollowHeartOverEightOz +
			obj.defects.hollowHeartUnderEightOz;
		acc[cellar].summaryOnes +=
			obj.netCalcs.fourToEightOz + obj.netCalcs.overEightOz;
		acc[cellar].summaryProcess += obj.netCalcs.process + obj.netCalcs.green;
		acc[cellar].summaryTare += obj.netCalcs.dirt;
		acc[cellar].totalFourToEightOz += obj.netCalcs.fourToEightOz;
		acc[cellar].totalOverEightOz += obj.netCalcs.overEightOz;

		return acc;
	}, {});

	const summaryByCellar = Object.values(averages).map((cellar: any) => {
		const counts = cellar.counts;
		const totalNetWeight = cellar.totalNetWeight;
		const totalGrossWeight = cellar.totalGrossWeight;
		return {
			cellar: cellar.cellar,
			counts: counts,
			variety: cellar.variety,
			defectCount: cellar.defectCount / counts,
			summaryCTN:
				cellar.totalOverEightOz /
				(cellar.totalFourToEightOz + cellar.totalOverEightOz),
			summaryFourToEightOz:
				cellar.totalFourToEightOz /
				(cellar.totalFourToEightOz + cellar.totalOverEightOz),
			summaryGreen: cellar.summaryGreen / totalNetWeight,
			summaryHH: cellar.summaryHH / totalNetWeight,
			summaryOnes: cellar.summaryOnes / totalNetWeight,
			summaryProcess: cellar.summaryProcess / totalNetWeight,
			summaryTare: cellar.summaryTare / totalGrossWeight,
		};
	});

	const formatTimeString = (time: any) => {
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

	console.log(docksides);

	return (
		<div className="table-container">
			<h1 className="report-header">
				Dockside Entries by Cellar for {date}
			</h1>
			<div className="header-subtext">
				<p>Document # 1.05.01A</p>
				<p>Prepared By _____________________</p>
				<p>Approved By _____________________</p>
			</div>
			{summaryByCellar.map((cellar: any) => (
				<table>
					<caption>{`${cellar.cellar} (${cellar.variety})`}</caption>
					<thead>
						<tr>
							<th>Time</th>
							<th>Defects</th>
							<th>% HH</th>
							<th>% Tare</th>
							<th>% Process</th>
							<th>% Green</th>
							<th>% 4-8 oz</th>
							<th>% CTN</th>
							<th>% #1's</th>
							<th>Quality Concerns</th>
							<th>Food Safety Concerns</th>
							<th>Released for Production</th>
						</tr>
					</thead>
					<tbody>
						{docksides.map((sample: any) =>
							sample.cellar === cellar.cellar ? (
								<tr>
									<td>{formatTimeString(sample.time)}</td>
									<td>{sample.defectCount}</td>
									<td>
										{`${convertToPercentage(
											sample.defects
												.hollowHeartUnderEightOz +
												sample.defects
													.hollowHeartOverEightOz
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryTare
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryProcess
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryGreen
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryFourToEightOz
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryCTN
										)}%`}
									</td>
									<td>
										{`${convertToPercentage(
											sample.summaryOnes
										)}%`}
									</td>
									<td>{sample.concerns.qualityConcerns}</td>
									<td>
										{sample.concerns.foodSafetyConcerns}
									</td>
									<td>
										{sample.concerns.releasedForProduction}
									</td>
								</tr>
							) : null
						)}
						<tr className="summary-row">
							<td>{`${cellar.counts} entries`}</td>
							<td>{cellar.defectCount.toFixed(2)}</td>
							<td>{`${convertToPercentage(
								cellar.summaryHH
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryTare
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryProcess
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryGreen
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryFourToEightOz
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryCTN
							)}%`}</td>
							<td>{`${convertToPercentage(
								cellar.summaryOnes
							)}%`}</td>
						</tr>
					</tbody>
				</table>
			))}
		</div>
	);
};

export default DailySummary;
