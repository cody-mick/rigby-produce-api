import {
	Box,
	Divider,
	LinearProgress,
	Table,
	TableBody,
	TableCell,
	tableCellClasses,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Card,
	CircularProgress,
	CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
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

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14,
		},
	}));

	const StyledTableRow = styled(TableRow)(() => ({
		"&:nth-of-type(even)": {
			backgroundColor: "#CDCDCD",
		},
		// hide last border
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	}));

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
				{docksides[0]?.cellar} - {docksides[0]?.variety} - {reportDate}
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
							<Table
								sx={{
									minWidth: 650,
								}}>
								<TableHead>
									<StyledTableRow>
										<StyledTableCell
											align="center"
											colSpan={2}>
											{date}
										</StyledTableCell>
									</StyledTableRow>
									<StyledTableRow>
										{tableHeadings.map((heading) => (
											<StyledTableCell align="center">
												{heading}
											</StyledTableCell>
										))}
									</StyledTableRow>
								</TableHead>
								<TableBody>
									{arrayForDate.map((sample) => (
										<StyledTableRow
											key={sample.time}
											sx={{
												"&:last-child td, &:last-child th":
													{ border: 0 },
											}}>
											<StyledTableCell align="center">
												{sample.fieldNo}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.truckNo}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.tubeNo}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.sampleTemp}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.grossWeight}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.dirt.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.netWeight.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{(
													sample.defects
														.hollowHeartUnderEightOz +
													sample.defects
														.hollowHeartOverEightOz
												).toFixed(2)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.process.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.green.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.fourToEightOz.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{sample.netCalcs.overEightOz.toFixed(
													2
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{(
													sample.netCalcs
														.fourToEightOz +
													sample.netCalcs.overEightOz
												).toFixed(2)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{convertToPercentage(
													sample.summaryProcess
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{convertToPercentage(
													sample.summaryGreen
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{convertToPercentage(
													sample.summaryFourToEightOz
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{convertToPercentage(
													sample.summaryCTN
												)}
											</StyledTableCell>
											<StyledTableCell align="center">
												{convertToPercentage(
													sample.summaryOnes
												)}
											</StyledTableCell>
										</StyledTableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					);
				})}
			</Box>
			<Divider sx={{ marginTop: "15px", marginBottom: "10px" }} />
			<Box sx={{ display: "flex", gap: "15px" }}>
				<Grid container xs={6} spacing={2}>
					{Object.keys(summaryTotals).map((category) => (
						<Grid xs={4}>
							<Card variant="outlined">
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
										<p>
											{summaryTotals[category].toFixed(2)}
										</p>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
				<Grid container xs={6} spacing={2}>
					{Object.keys(summaryPercentages).map((category) => (
						<Grid xs={6}>
							<Card variant="outlined">
								<CardContent
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}>
									<p>
										{
											summaryPercentages[category]
												.displayName
										}
									</p>
									{loading ? (
										<CircularProgress size={20} />
									) : (
										<p>
											{convertToPercentage(
												summaryPercentages[category]
													.amount
											)}
											&nbsp; %
										</p>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
		</Box>
	);
};

export default CellarReportMUI;
