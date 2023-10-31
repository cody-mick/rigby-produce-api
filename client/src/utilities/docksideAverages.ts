import Dockside from "../../types/Dockside";

type Accumulator = {
	[cellar: string]: {
		cellar: string;
		counts: number;
		totalGrossWeight: number;
		totalNetWeight: number;
		defectCount: number;
		summaryCTN: number;
		summaryFourToEightOz: number;
		summaryGreen: number;
		summaryHH: number;
		summaryOnes: number;
		summaryProcess: number;
		summaryTare: number;
		totalFourToEightOz: number;
		totalOverEightOz: number;
		variety: string;
	};
};

const docksideAverages = (docksides: Dockside[]): Accumulator => {
	return docksides.reduce((acc: any, obj: any) => {
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
};

export default docksideAverages;
