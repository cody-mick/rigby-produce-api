import Dockside from "../../types/Dockside";

const grandTotals = (samples: Dockside[]) => {
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
};

const cellarPercentages = (samples: Dockside[]) => {
	const totals = grandTotals(samples);
	const percentages: any = {
		hollowHeart: { amount: 0, displayName: "% HH" },
		process: { amount: 0, displayName: "% Process" },
		green: { amount: 0, displayName: "% Green" },
		fourToEightOz: { amount: 0, displayName: "% 4-8 oz" },
		carton: { amount: 0, displayName: "% CTN" },
		ones: { amount: 0, displayName: "% #1's" },
	};

	percentages.hollowHeart.amount = totals.hollowHeart / totals.netWeight;
	percentages.process.amount =
		(totals.process + totals.green) / totals.netWeight;
	percentages.green.amount = totals.green / totals.netWeight;
	percentages.fourToEightOz.amount =
		totals.fourToEightOz / (totals.fourToEightOz + totals.overEightOz);
	percentages.carton.amount =
		totals.overEightOz / (totals.fourToEightOz + totals.overEightOz);
	percentages.ones.amount =
		(totals.fourToEightOz + totals.overEightOz) / totals.netWeight;

	return percentages;
};

export default { grandTotals, cellarPercentages };
