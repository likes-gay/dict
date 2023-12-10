/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { AriaRole, Children, PropsWithChildren, ReactElement, ReactNode, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const id = useId();

	const ariaAttribute: Record<AriaRelationshipOps, string> = {
		label: "aria-labelledby",
		description: "aria-describedby",
		details: "aria-details",
		none: ""
	};

	useEffect(() => {
		function onEsc(e: KeyboardEvent) {
			if(e.key != "Escape") return;
			setShowTooltip(false);
		}

		
		function windowClick(e: MouseEvent) {
			//console.log("Click contain:", tooltip.current == e.target || tooltip.current?.contains(e.target as any));
			//if(tooltip.current?.contains(e.target as Node)) return;
			//setShowTooltip(false);
		}
		
		if(showTooltip) {
			document.addEventListener("keydown", onEsc);
			document.addEventListener("click", windowClick);
		}

		return () => {
			document.removeEventListener("keydown", onEsc);
			document.removeEventListener("click", windowClick);
		};
	}, [showTooltip]);

	function GetToolTipPos() {
		const scroll = document.documentElement.scrollTop;
	
		const targetPos = interest.current!.getBoundingClientRect();
		const yLoc = targetPos.y + scroll - 50;
		const xLoc = targetPos.x;

		return {
			top: yLoc,
			left: xLoc
		};
	}

	function onClick() {
		props.children.props.onClick();
		setShowTooltip(true);
	}

	function onFocus() {
		setShowTooltip(true);
	}

	function onBlur(e: React.FocusEvent<HTMLElement, Element>) {
		setShowTooltip(false);
	}

	function onTouchStart(e: React.TouchEvent<HTMLElement>) {
		return;
	//	if(showTooltip) return;
	//	intervalRef.current = setTimeout(() => {
	//		intervalRef.current = null;
	//	}, 300);
	}

	function onTouchEnd(e: React.TouchEvent<HTMLElement>) {
		return;
	//	if(showTooltip) return;
	//	if(intervalRef.current) {
	//		clearTimeout(intervalRef.current);
	//		intervalRef.current = null;
	//		return;
	//	};
	//	e.preventDefault();
	//	e.stopPropagation();
	}

	function onMouseEnter() {
		setShowTooltip(true);
	}

	function onMouseLeave(e: React.MouseEvent<HTMLElement>) {
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
						onClick,
						onFocus,
						onBlur,
						onTouchStart,
						onTouchEnd,
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