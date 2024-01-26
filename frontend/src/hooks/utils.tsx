import { Word } from "../types";

export function createWordDomId(props: Word) {
	return `dfn-${props.word.replaceAll(/\s/g, "_")}:${props.id}`;
}

export function createDescriptionDomId(props: Word) {
	return `description-${props.word.replaceAll(/\s/g, "_")}:${props.id}`;
}

export function LinkIcon() {
	return (
		<svg className="link-iocn" stroke="white" fill="none" strokeWidth={3} width={30} height={30} viewBox="0 0 24 24">
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
			/>
		</svg>
	);
}

export function UpdootIcon() {
	return (
		<svg  className="arrow-icon" width={30} height={30} viewBox="0 0 256 256">
			<path
				d="M231.39062,123.06152A8,8,0,0,1,224,128H184v80a16.01833,16.01833,0,0,1-16,16H88a16.01833,16.01833,0,0,1-16-16V128H32a8.00065,8.00065,0,0,1-5.65723-13.65723l96-96a8.003,8.003,0,0,1,11.31446,0l96,96A8.002,8.002,0,0,1,231.39062,123.06152Z"
			/>
		</svg>
	);
}

export function AudioIcon() {
	return (
		<svg className="audio-icon" fill="white" height={30} width={34} viewBox="0 0 576 512">
			<path
				d="M333.1 34.8C344.6 40 352 51.4 352 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L163.8 352H96c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L298.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zm172 72.2c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C507.3 341.3 528 301.1 528 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C466.1 199.1 480 225.9 480 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C425.1 284.4 432 271 432 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5z"
			/>
		</svg>
	);
}

export function ChevronIcon() {
	return (
		<svg className="chevron-icon" width={30} height={30} viewBox="0 0 50 50">
			<polyline points="10 35 25 15 40 35" stroke="currentColor" fill="none" strokeWidth={4} />
		</svg>
	);
}