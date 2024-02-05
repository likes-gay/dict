import React, { ReactElement, ReactNode, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";

type AriaRelationshipOps = "label" | "description" | "details" | "none";

type TooltipProps = {
	toolTipContent: ReactNode;
	children: ReactElement;
	ariaRelationships?: AriaRelationshipOps;
	removeTabIndex?: boolean;
};

export default function Tooltip(props: TooltipProps) {
	const [showTooltip, setShowTooltip] = useState(false);

	const [interest, setInterest] = useState<HTMLElement | null>(null);
	const [tooltip, setTooltip] = useState<HTMLDivElement | null>(null);

	const id = useId();

	const { styles } = usePopper(interest, tooltip, {
		placement: "top",
		modifiers: [
			{
				name: "flip",
				options: {
					fallbackPlacements: ["bottom"],
				},
			},
		],
	});

	const ariaAttribute: Record<AriaRelationshipOps, string> = {
		label: "aria-labelledby",
		description: "aria-describedby",
		details: "aria-details",
		none: "",
	};

	useEffect(() => {
		function onEsc(e: KeyboardEvent) {
			if(e.key != "Escape") return;
			setShowTooltip(false);
		}

		function onMouseOver(e: MouseEvent) {
			const target = e.target as Node;

			if(interest?.contains(target) || tooltip?.contains(target)) return;
			
			setShowTooltip(false);
		}
		
		if(showTooltip) {
			document.addEventListener("keydown", onEsc);
			window.addEventListener("mouseover", onMouseOver);
		}

		return () => {
			document.removeEventListener("keydown", onEsc);
			window.removeEventListener("mouseover", onMouseOver);
		};
	}, [tooltip]);

	function onClick(e: React.MouseEvent) {
		props.children.props.onClick?.();

		if(e.currentTarget == interest) return;
		setShowTooltip(true);
	}

	function onFocus() {
		setShowTooltip(true);
	}

	function onBlur() {
		setShowTooltip(false);
	}

	function onMouseEnter() {
		setShowTooltip(true);
	}

	return (
		<>
			{
				React.cloneElement(
					props.children,
					{
						[ariaAttribute[props.ariaRelationships || "description"]]: showTooltip && props.ariaRelationships != "none" ? id : undefined,
						tabIndex: ["button", "a"].includes(props.children.type.toString()) || props.removeTabIndex ? undefined : 0,
						ref: setInterest,
						onClick,
						onFocus,
						onBlur,
						onMouseEnter,
					},
				)
			}
			{
				showTooltip && createPortal(
					<div
						id={id}
						ref={setTooltip}
						style={styles.popper}
						className="tooltip"
						role="tooltip"
					>
						{props.toolTipContent}
					</div>,
					document.body,
				)
			}
		</>
	);
}