import {
	Box,
	Divider,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
	CircularProgress,
	CardContent,
} from "@mui/material";
import Dockside from "../../types/Dockside";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useQueryParams from "../hooks/useQueryParams";
import cellarGrandTotals from "../utilities/cellarGrandTotals";
import cellarReportHeadings from "../utilities/cellarReportHeadings";
import convertToPercentage from "../utilities/convertToPercentage";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import camelToTitle from "../utilities/camelToTitle";

const CellarReportMUI = () => {
	const [docksides, setDocksides] = useState<Dockside[]>([]);
	const [loading, setLoading] = useState(false);
	const { cellarId } = useParams();
	let query = useQueryParams();
	const reportDate = query.get("date") || new Date().getFullYear();

	useEffect(() => {
		setLoading(true);
		fetch(`/api/docksides/by-cellar/${cellarId}`)
			.then((res) => res.json())
			.then((data) => {
				setDocksides(data);
				setLoading(false);
			});
	}, []);

	const samplesByDay: { [key: string]: Dockside[] } = {};
	docksides.map((sample: any) => {
		const date = sample.date.split("T")[0]; // Extract the date
		if (!samplesByDay[date]) {
			samplesByDay[date] = []; // Create a new array for the date if it doesn't exist
		}
		samplesByDay[date].push(sample); // Push the object to the corresponding date array.
	});

	const summaryTotals = cellarGrandTotals.grandTotals(docksides);
	const summaryPercentages = cellarGrandTotals.cellarPercentages(docksides);
	const tableHeadings = cellarReportHeadings;

	return (
		<Box className="page-container" sx={{ padding: "10px" }}>
			<h1 className="report-title">Rigby Produce Dockside Report</h1>
			<h2>
				{docksides[0]?.cellar} | {docksides[0]?.variety} | {reportDate}
			</h2>
			<p>{docksides[0]?.type}</p>
			{loading && (
				<Box sx={{ width: "100%", padding: "5px" }}>
					<LinearProgress />
				</Box>
			)}
			<Box>
				{Object.keys(samplesByDay).map((date) => {
					const arrayForDate = samplesByDay[date];
					return (
						<TableContainer
							component={Paper}
							sx={{
								marginTop: "10px",
								marginBottom: "10px",
							}}>
							<p className="table-date">{date}</p>
							<Table
								sx={{
									minWidth: 650,
								}}>
								<TableHead>
									<TableRow>
										{tableHeadings.map((heading) => (
											<TableCell
												align="center"
												sx={{ color: "white" }}>
												{heading}
											</TableCell>
										))}
									</TableRow>
								</TableHead>
								<TableBody>
									{arrayForDate.map((sample) => (
										<TableRow
											key={sample.time}
											sx={{
												"&:last-child td, &:last-child th":
													{ border: 0 },
											}}>
											<TableCell align="center">
												{sample.fieldNo}
											</TableCell>
											<TableCell align="center">
												{sample.truckNo}
											</TableCell>
											<TableCell align="center">
												{sample.tubeNo}
											</TableCell>
											<TableCell align="center">
												{sample.sampleTemp}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.grossWeight}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.dirt.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.netWeight.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{(
													sample.defects
														.hollowHeartUnderEightOz +
													sample.defects
														.hollowHeartOverEightOz
												).toFixed(2)}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.process.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.green.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.fourToEightOz.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{sample.netCalcs.overEightOz.toFixed(
													2
												)}
											</TableCell>
											<TableCell align="center">
												{(
													sample.netCalcs
														.fourToEightOz +
													sample.netCalcs.overEightOz
												).toFixed(2)}
											</TableCell>
											<TableCell align="center">
												{convertToPercentage(
													sample.summaryProcess
												)}
											</TableCell>
											<TableCell align="center">
												{convertToPercentage(
													sample.summaryGreen
												)}
											</TableCell>
											<TableCell align="center">
												{convertToPercentage(
													sample.summaryFourToEightOz
												)}
											</TableCell>
											<TableCell align="center">
												{convertToPercentage(
													sample.summaryCTN
												)}
											</TableCell>
											<TableCell align="center">
												{convertToPercentage(
													sample.summaryOnes
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					);
				})}
			</Box>
			<Divider />
			<Grid container spacing={2} sx={{ margin: "12px" }}>
				{Object.keys(summaryTotals).map((category) => (
					<Card
						variant="outlined"
						sx={{
							minWidth: 250,
							margin: "5px",
						}}>
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<p>{camelToTitle(category)}</p>
							{loading ? (
								<CircularProgress size={20} />
							) : (
								<p>{summaryTotals[category].toFixed(2)}</p>
							)}
						</CardContent>
					</Card>
				))}
			</Grid>
			<Grid container spacing={2} sx={{ margin: "12px" }}>
				{Object.keys(summaryPercentages).map((category) => (
					<Card
						variant="outlined"
						sx={{ minWidth: 250, margin: "5px" }}>
						<CardContent
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}>
							<p>{summaryPercentages[category].displayName} </p>
							{loading ? (
								<CircularProgress size={20} />
							) : (
								<p>
									{convertToPercentage(
										summaryPercentages[category].amount
									)}
									&nbsp; %
								</p>
							)}
						</CardContent>
					</Card>
				))}
			</Grid>
		</Box>
	);
};

export default CellarReportMUI;
