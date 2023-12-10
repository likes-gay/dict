import { ForwardedRef, HTMLInputTypeAttribute, forwardRef, useRef, useState } from "react";
import { NewUploadedWord, UploadWord, Word } from "./types";
import { createWordDomId } from "./hooks/utils";

type AddNewWordProps = {
	onSubmit?: (newWord: Word) => void
}

type InputValidateProps = {
	label: string;
	type: "textarea" | HTMLInputTypeAttribute;
	id: string;
	required?: boolean;
};

type InputValidateHTMLElements = HTMLInputElement | HTMLTextAreaElement;

const InputValidate = forwardRef((props: InputValidateProps, ref: ForwardedRef<InputValidateHTMLElements>) => {
	const [isInvalid, setIsInvalid] = useState(false);

	function onChange(e: React.ChangeEvent<InputValidateHTMLElements>) {
		if(!props.required || !isInvalid && e.target.value) return;
		setIsInvalid(false);
	}	

	function onBlur(e: React.FocusEvent<InputValidateHTMLElements, Element>) {
		if(!props.required || !isInvalid && e.target.value.length) return;
		setIsInvalid(true);
	}

	const allProps = {
		id: props.id,
		className: "input",
		"aria-errormessage": isInvalid ? `${props.id}-error` : undefined,
		onBlur,
		onChange,
		required: props.required
	};

	const element = props.type == "textarea" ?
		<textarea
			ref={ref as ForwardedRef<HTMLTextAreaElement>}
			{...allProps}
		/> :
		<input
			type={props.type}
			ref={ref as ForwardedRef<HTMLInputElement>}
			{...allProps}
		/>;

	return (
		<>
			{isInvalid &&
				<div id={`${props.id}-error`} className="error-box">
					"{props.label}" is a required field
				</div>
			}
			<label htmlFor={props.id}>
				{props.label}:
				{props.required && <>{" "}<span className="required-text">(required)</span></>}	
			</label>
			{element}
		</>
	);
});

export default function	AddNewWord(props: AddNewWordProps) {
	const wordInput	= useRef<HTMLInputElement>(null);
	const descriptionInput = useRef<HTMLTextAreaElement>(null);
	const dateInput	= useRef<HTMLInputElement>(null);
	const uploaderInput	= useRef<HTMLInputElement>(null);

	const [newWordId, setNewWordId] = useState<string>("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const newWord: NewUploadedWord = await fetch("/api/upload_word", {
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				word: wordInput.current!.value,
				description: descriptionInput.current!.value,
				creationDate: (dateInput.current!.valueAsDate || new Date()).getTime(),
				uploader: uploaderInput.current!.value
			} as UploadWord),
			method:	"POST"
		}).then(x => x.json());

		setNewWordId(createWordDomId(newWord));
		if(props.onSubmit) props.onSubmit(newWord);
	}

	return (
		<form onSubmit={onSubmit} aria-labelledby="add-new-word">
			<h2 id="add-new-word">Add a New Word</h2>

			<InputValidate
				type="text"
				label="Word"
				id="word"
				ref={wordInput}
				required
			/>

			<InputValidate
				type="textarea"
				label="Definition"
				id="definition"
				ref={descriptionInput}
				required
			/>
			
			<InputValidate
				type="text"
				label="Uploader"
				id="uploader"
				ref={uploaderInput}
			/>

			<InputValidate
				type="date"
				label="Word creation date"
				id="date"
				ref={dateInput}
			/>
			
			<button className="submit-button">Submit</button>
			
			{newWordId &&
				<output htmlFor="word definition date uploader">
					<p>
						World uploaded!
						<br />
						<a href={`#${newWordId}`}>Link to new word</a>
					</p>
				</output>
			}
		</form>
	);
}