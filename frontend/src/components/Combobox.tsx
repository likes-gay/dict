/* eslint-disable react/no-unknown-property */
import React, { ReactNode, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronIcon } from "../hooks/utils";
import { usePopper } from "react-popper";

type ComboboxOption = {
	content: ReactNode;
	urlValue: string;
};

type ComboboxProps = {
	urlKey: string;
	options: ComboboxOption[];
	id?: string;
	onUpdate?: (urlKey: string, urlValue: string) => void;
};

export default function Combobox(props: ComboboxProps) {
	const intialIndex = useMemo(() => (
		props.options.findIndex((option) => option.urlValue == new URLSearchParams(location.search).get(props.urlKey))
	), [props.options]);
	const [focusedOptionIndex, setFocusedOptionIndex] = useState(intialIndex == -1 ? 0 : intialIndex);
	const [confirmedOptionIndex, setConfirmedOptionIndex] = useState(intialIndex == -1 ? 0 : intialIndex);
	const longestWord = useMemo(() => 15, [props.options]);
	
	const [button, setButton] = useState<HTMLButtonElement | null>(null);
	const [listbox, setListbox] = useState<HTMLUListElement | null>(null);
	const focusedOption = useRef<HTMLAnchorElement>(null);

	const listboxId = `${props.id || useId()}-listbox`;

	const popper = usePopper(button, listbox, {
		placement: "bottom-start",
		modifiers: [
			{
				name: "flip",
				options: {
					fallbackPlacements: ["top-start"],
				},
			},
		],
	});

	useEffect(() => {
		function onToggle() {
			popper.update?.();
		}

		listbox?.addEventListener("toggle", onToggle);

		return () => {
			listbox?.removeEventListener("toggle", onToggle);
		};
	}, [listbox]);

	useEffect(() => {
		focusedOption.current?.focus();
	}, [focusedOptionIndex]);

	useEffect(() => {
		props.onUpdate?.(props.urlKey, props.options[confirmedOptionIndex].urlValue);
	}, [confirmedOptionIndex]);

	function CreateUrl(urlValue: string, index: number) {
		const searchParams = new URLSearchParams(location.search);
		
		if(!index) searchParams.delete(props.urlKey);
		else searchParams.set(props.urlKey, urlValue);
	
		const paramsStr = searchParams.toString();
	
		return paramsStr ? `?${paramsStr}` : "/";
	}

	function onButtonKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
		if(e.key != "ArrowDown") return;
		e.preventDefault();
		
		setFocusedOptionIndex((i) => {
			const newI = i + 1;
			if(newI == props.options.length) return 0;
			return newI;
		});
		listbox?.showPopover();
	}

	function onOptionKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
		if(!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
		e.preventDefault();
		
		let newIndex = focusedOptionIndex;

		if(e.key == "ArrowUp") newIndex--;
		else if(e.key == "ArrowDown") newIndex++;
		
		if(e.key == "Home" || newIndex < 0) newIndex = props.options.length - 1;
		else if(e.key == "End" || newIndex >= props.options.length) newIndex = 0;

		setFocusedOptionIndex(newIndex);
	}
	
	return (
		<>
			<button
				onKeyDown={onButtonKeyDown}
				id={props.id}
				className="combobox-button"
				ref={setButton}
				style={{
					width: `${longestWord}ch`,
				}}
				//@ts-expect-error The Popover API isn't supported by React or its types yet
				popovertarget={listboxId}
				aria-controls={listboxId}
				aria-haspopup="listbox"
				role="combobox"
			>
				{props.options[confirmedOptionIndex].content}
				<ChevronIcon />
			</button>
			<ul
				id={listboxId}
				style={{
					...popper.styles.popper,
					width: `${longestWord}ch`,
				}}
				className="listbox"
				role="listbox"
				ref={setListbox}
				onKeyDown={onOptionKeyDown}
				//@ts-expect-error The Popover API isn't supported by React or its types yet
				popover=""
			>
				{props.options.map((option, i) => (
					<li
						className="listbox-option"
						role="none"
						key={option.urlValue}
					>
						<a
							href={CreateUrl(option.urlValue, i)}
							onClick={(e) => {
								e.preventDefault();
								setConfirmedOptionIndex(i);
								history.pushState({}, "", CreateUrl(option.urlValue, i));
								listbox?.hidePopover();
							}}
							onKeyDown={(e) => {
								if(e.key != " ") return;
								e.preventDefault();
								e.currentTarget.click();
							}}
							tabIndex={focusedOptionIndex == i ? undefined : -1}
							autoFocus={focusedOptionIndex == i}
							ref={focusedOptionIndex == i ? focusedOption : undefined}
							role="option"
							aria-selected={confirmedOptionIndex == i}
						>
							{option.content}
						</a>
					</li>
				))}
			</ul>
		</>
	);
}