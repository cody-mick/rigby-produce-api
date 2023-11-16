import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import convertToPercentage from "../utilities/convertToPercentage";
import formatTimeString from "../utilities/formatTimeString";
import docksideAverages from "../utilities/docksideAverages";
import summaryByCellar from "../utilities/summaryByCellar";
// import useFetch from "../hooks/useFetch";

const DailySummary = () => {
	const [docksides, setDocksides] = useState([]);
	const { date } = useParams();

	useEffect(() => {
		async function fetchDocksides() {
			await fetch(
				`http://172.233.155.111:3333/api/docksides-by-date/${date}`
			)
				.then((res) => res.json())
				.then((data) => setDocksides(data));
		}
		fetchDocksides();
	}, []);

	const averages = docksideAverages(docksides);

	const cellarSummaries = summaryByCellar(averages);

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
			{cellarSummaries.map((cellar: any) => (
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
