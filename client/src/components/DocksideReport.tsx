import { useEffect, useState } from "react";
import Dockside from "../../types/Dockside";
import { useParams } from "react-router-dom";
import useQueryParams from "../hooks/useQueryParams";

const DocksideReport = () => {
	const [docksides, setDocksides] = useState<Dockside[]>([]);
	const { cellarId } = useParams();
	let query = useQueryParams();

	useEffect(() => {
		async function fetchDocksides() {
			await fetch(
				`http://localhost:8080/api/docksides-by-cellar/${cellarId}`
			)
				.then((res) => res.json())
				.then((data) => setDocksides(data));
		}
		fetchDocksides();
	}, []);

	const reportDate = query.get("date") || new Date().getFullYear();

	const samplesByDay: { [key: string]: Dockside[] } = {};
	docksides.map((sample: any) => {
		const date = sample.date.split("T")[0]; // Extract the date
		if (!samplesByDay[date]) {
			samplesByDay[date] = []; // Create a new array for the date if it doesn't exist
		}
		samplesByDay[date].push(sample); // Push the object to the corresponding date array
	});

	const convertToPercentage = (num: number) => {
		return (num * 100).toFixed(2);
	};

	function calculateGrandTotals(samples: Dockside[]): Record<string, number> {
		const grandTotals: Record<string, number> = {
			grossWeight: 0,
			netWeight: 0,
			tare: 0,
			hollowHeart: 0,
			process: 0,
			green: 0,
			fourToEightOz: 0,
			overEightOz: 0,
			ones: 0,
		};

		samples.forEach((sample) => {
			grandTotals.grossWeight += sample.netCalcs.grossWeight;
			grandTotals.netWeight += sample.netCalcs.netWeight;
			grandTotals.tare += sample.netCalcs.dirt;
			grandTotals.hollowHeart +=
				sample.defects.hollowHeartUnderEightOz +
				sample.defects.hollowHeartOverEightOz;
			grandTotals.process += sample.netCalcs.process;
			grandTotals.green += sample.netCalcs.green;
			grandTotals.fourToEightOz += sample.netCalcs.fourToEightOz;
			grandTotals.overEightOz += sample.netCalcs.overEightOz;
			grandTotals.ones +=
				sample.netCalcs.fourToEightOz + sample.netCalcs.overEightOz;
		});

		return grandTotals;
	}

	const summaryTotals = calculateGrandTotals(docksides);

	return (
		<div className="table-container">
			<h1 className="report-title">Rigby Produce Dockside Report</h1>
			<h2>
				{docksides[0]?.cellar} - {docksides[0]?.variety} - {reportDate}
			</h2>
			{/* Make this dynamic eventually. Either farm or warehouse */}
			<p>{docksides[0]?.type}</p>
			<div>
				{Object.keys(samplesByDay).map((date) => {
					const arrayForDate = samplesByDay[date];
					return (
						<div key={date}>
							<h3>{date}</h3>
							<table>
								<thead>
									<td>Field</td>
									<td>Truck</td>
									<td>Tube</td>
									<td>Temp</td>
									<td>Weight</td>
									<td>Tare</td>
									<td>Net Wt</td>
									<td>HH</td>
									<td>Process</td>
									<td>Green</td>
									<td>4-8 oz</td>
									<td>Over 8 oz</td>
									<td>#1's</td>
									<td>% Process</td>
									<td>% Green</td>
									<td>% 4-8 oz</td>
									<td>% CTN</td>
									<td>% #1's</td>
								</thead>
								<tbody>
									{arrayForDate.map((sample) => (
										<tr>
											<td>{sample.fieldNo}</td>
											<td>{sample.truckNo}</td>
											<td>{sample.tubeNo}</td>
											<td>{sample.sampleTemp}</td>
											<td>
												{sample.netCalcs.grossWeight}
											</td>
											<td>
												{sample.netCalcs.dirt.toFixed(
													2
												)}
											</td>
											<td>
												{sample.netCalcs.netWeight.toFixed(
													2
												)}
											</td>
											<td>
												{(
													sample.defects
														.hollowHeartUnderEightOz +
													sample.defects
														.hollowHeartOverEightOz
												).toFixed(2)}
											</td>
											<td>
												{sample.netCalcs.process.toFixed(
													2
												)}
											</td>
											<td>
												{sample.netCalcs.green.toFixed(
													2
												)}
											</td>
											<td>
												{sample.netCalcs.fourToEightOz.toFixed(
													2
												)}
											</td>
											<td>
												{sample.netCalcs.overEightOz.toFixed(
													2
												)}
											</td>
											<td>
												{(
													sample.netCalcs
														.fourToEightOz +
													sample.netCalcs.overEightOz
												).toFixed(2)}
											</td>
											<td>
												{convertToPercentage(
													sample.summaryProcess
												)}
												%
											</td>
											<td>
												{convertToPercentage(
													sample.summaryGreen
												)}
												%
											</td>
											<td>
												{convertToPercentage(
													sample.summaryFourToEightOz
												)}
												%
											</td>
											<td>
												{convertToPercentage(
													sample.summaryCTN
												)}
												%
											</td>
											<td>
												{convertToPercentage(
													sample.summaryOnes
												)}
												%
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					);
				})}
				<div className="divider"></div>
				<div className="totals-section">
					<h3>Totals</h3>
					<div className="totals-grid">
						<div className="total-cell">
							<p>Weight</p>
							<p>{summaryTotals.grossWeight.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>HH</p>
							<p>{summaryTotals.hollowHeart.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>4-8 oz</p>
							<p>{summaryTotals.fourToEightOz.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>Net Weight</p>
							<p>{summaryTotals.netWeight.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>Process</p>
							<p>{summaryTotals.process.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>Over 8 oz</p>
							<p>{summaryTotals.overEightOz.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>Tare</p>
							<p>{summaryTotals.tare.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>Green</p>
							<p>{summaryTotals.green.toFixed(2)}</p>
						</div>
						<div className="total-cell">
							<p>#1's</p>
							<p>{summaryTotals.ones.toFixed(2)}</p>
						</div>
					</div>
					<div className="percentages-grid">
						<div className="total-cell">
							<p>% Process</p>
							<p>
								{convertToPercentage(
									(summaryTotals.process +
										summaryTotals.green) /
										summaryTotals.netWeight
								)}
								%
							</p>
						</div>
						<div className="total-cell">
							<p>% 4-8 oz</p>
							<p>
								{convertToPercentage(
									summaryTotals.fourToEightOz /
										(summaryTotals.fourToEightOz +
											summaryTotals.overEightOz)
								)}
								%
							</p>
						</div>
						<div className="total-cell">
							<p>% Green</p>
							<p>
								{convertToPercentage(
									summaryTotals.green /
										summaryTotals.netWeight
								)}
								%
							</p>
						</div>
						<div className="total-cell">
							<p>% CTN</p>
							<p>
								<strong>
									{convertToPercentage(
										summaryTotals.overEightOz /
											(summaryTotals.fourToEightOz +
												summaryTotals.overEightOz)
									)}
									%
								</strong>
							</p>
						</div>
						<div className="total-cell">
							<p>% HH</p>
							<p>
								{convertToPercentage(
									summaryTotals.hollowHeart /
										summaryTotals.netWeight
								)}
								%
							</p>
						</div>
						<div className="total-cell">
							<p>% #1's</p>
							<p>
								<strong>
									{convertToPercentage(
										(summaryTotals.fourToEightOz +
											summaryTotals.overEightOz) /
											summaryTotals.netWeight
									)}
									%
								</strong>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DocksideReport;
