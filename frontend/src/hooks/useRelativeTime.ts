import { useEffect, useState } from "react";

export default function useRelativeTime(date: Date) {
	const [relativeTime, setRelativeTime] = useState<string>("");

	useEffect(() => {
		let interval: NodeJS.Timeout;
		let previousTimeUnit: Intl.RelativeTimeFormatUnit;

		function getRelativeTime() {
			const timePassed = new Date().getTime() - date.getTime();
			const secondsPast = Math.floor(timePassed / 1000);

			const units = {
				second: 1, //The unit of time in seconds
				minute: 60,
				hour: 3600,
				day: 86400,
				week: 604800,
				month: 2592000,
				year: 31536000,
			};

			let highestTimeUnit: keyof typeof units = "second";

			for(const [timeUnit, value] of Object.entries(units) as [keyof typeof units, number][]) {
				if(secondsPast > value) {
					highestTimeUnit = timeUnit;
				} else {
					break;
				}
			}

			const formatter = new Intl.RelativeTimeFormat("en-GB", { style: "long" });
			const relativeTime = formatter.format(
				-Math.floor(timePassed / (units[highestTimeUnit] * 1000)),
				highestTimeUnit,
			);

			setRelativeTime(relativeTime);
			
			if(!["second", "minute", "hour"].includes(highestTimeUnit)) {
				clearInterval(interval);
			} else if(highestTimeUnit != previousTimeUnit) {
				clearInterval(interval);
				previousTimeUnit = highestTimeUnit;
				interval = setInterval(getRelativeTime, units[highestTimeUnit] * 1000);
			}
		}

		getRelativeTime();

		return () => {
			console.log("clearing interval");
			clearInterval(interval);
		};
	}, []);

	return relativeTime;
}