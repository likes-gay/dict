import React, { Children, PropsWithChildren, ReactElement, ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AriaRelationshipOps = "label" | "description" | "details" | "none";

type TooltipProps = {
	toolTipContent: ReactNode;
	children: ReactElement;
	ariaRelationships?: AriaRelationshipOps;
};

export default function Tooltip(props: TooltipProps) {
	const [showTooltip, setShowTooltip] = useState(false);
	const interest = useRef<HTMLElement>(null);
	const tooltip = useRef<HTMLDivElement>(null);
	const id = useId();

	const ariaAttribute: Record<AriaRelationshipOps, string> = {
		"label": "aria-labelledby",
		"description": "aria-describedby",
		"details": "aria-details",
		"none": ""
	};

	useEffect(() => {
		function onEsc(e: KeyboardEvent) {
			if(e.key != "Escape") return;
			setShowTooltip(false);
		}
		
		if(showTooltip) window.addEventListener("keydown", onEsc);

		return () => window.removeEventListener("keydown", onEsc);

	}, [showTooltip]);

	function GetToolTipPos() {
		const scroll = document.documentElement.scrollTop;
	
		let targetPos = interest.current!.getBoundingClientRect();
		let yLoc = targetPos.y + scroll - 50;
		let xLoc = targetPos.x;

		return {
			top: yLoc,
			left: xLoc
		};
	}

	function onFocus() {
		setShowTooltip(true);
	}

	function onBlur() {
		setShowTooltip(false);
	}

	function onLongPress() {
		setShowTooltip(true);
	}

	function onMouseEnter() {
		setShowTooltip(true);
	}

	function onMouseLeave(e: React.MouseEvent<unknown>) {
		if(e.target != document.activeElement)
			setShowTooltip(false);
	}

	return (
		<>
			{
				React.cloneElement(
					props.children,
					{
						[ariaAttribute[props.ariaRelationships || "description"]]: showTooltip && props.ariaRelationships != "none" ? id : undefined,
						tabIndex: props.children.type != "button" ? 0 : undefined,
						ref: interest,
						onFocus,
						onBlur,
						onLongPress,
						onMouseEnter,
						onMouseLeave
					}
				)
			}
			{
				showTooltip && createPortal(
					<div
						id={id}
						ref={tooltip}
						style={GetToolTipPos()}
						className="tooltip"
						role="tooltip"
					>
						{props.toolTipContent}
					</div>,
					document.body
				)
			}
		</>
	);
}