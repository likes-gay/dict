import { Fragment } from "react";

type WordDescriptionProps = {
	description: string;
};

export default function WordDescription({ description }: WordDescriptionProps) {
	const splitDescription = description.split("\n");

	return (
		splitDescription.map((line, index) => (
			<Fragment key={index}>
				{line}
				{index == splitDescription.length - 1 ? null : <br />}
			</Fragment>
		))
	);
}