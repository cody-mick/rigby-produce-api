const summaryByCellar = (averages: any) => {
	return Object.values(averages).map((cellar: any) => {
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
};

export default summaryByCellar;
