import Dockside from "../../types/Dockside";

const cellarGrandTotals = (samples: Dockside[]) => {
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

export default cellarGrandTotals;
