import { useState } from "react";
import { UploadWord, UploadWordError, Word } from "./types";
import { ChevronIcon, createWordDomId } from "./hooks/utils";

type AddNewWordProps = {
	onSubmitFinished?: () => void
}

export default function	AddNewWord(props: AddNewWordProps) {
	const [newWordDomId, setNewWordDomId] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState<string>("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setNewWordDomId("");
		setErrorMsg("");

		const formData = new FormData(e.target as HTMLFormElement);
		
		const creationDate = formData.get("date") ?
			new Date(formData.get("date") as string).getTime() :
			new Date().getTime();

		const res = await fetch("/api/upload_word", {
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				word: formData.get("word"),
				description: formData.get("definition"),
				creationDate,
				uploader: formData.get("uploader"),
				isRobot: formData.get("robot") == "on",
			} as UploadWord),
			method:	"POST",
		});
		const newWord: UploadWordError | Word | string = await res.json();

		if(!res.ok) {
			setErrorMsg((newWord as UploadWordError).detail || newWord as string);
			return;
		}

		(e.target as HTMLFormElement).reset();
		props.onSubmitFinished?.();
		setNewWordDomId(createWordDomId(newWord as Word));
	}

	return (
		<form onSubmit={onSubmit} aria-labelledby="add-new-word">
			<details>
				<summary>
					<ChevronIcon />
					<h2 id="add-new-word">Add a New Word</h2>
				</summary>

				<div className="field">
					<label htmlFor="word">
					Word: <span aria-hidden="true" className="required-text">(required)</span>
					</label>
					<input type="text" id="word" name="word" className="input" required />
				</div>
	
				<div className="field">
					<label htmlFor="definition">
					Definition: <span aria-hidden="true" className="required-text">(required)</span>
					</label>
					<textarea
						id="definition"
						name="definition"
						className="input"
						required
					></textarea>
				</div>

				<div className="field">
					<label htmlFor="uploader">Uploader:</label>
					<input type="text" id="uploader" name="uploader" className="input" />
				</div>
	
				<div className="field">
					<label htmlFor="date">Word creation date:</label>
					<input type="date" id="date" name="date" className="input" />
				</div>

				<div className="field-checkbox">
					<input type="checkbox" id="robot" name="robot" />
					<label htmlFor="robot">Are you a robot?</label>
				</div>

				<div className="button-wrapper">
					<button className="submit-button">Submit</button>
				</div>

				{
					errorMsg && (
						<output htmlFor="word definition date uploader">
							<p className="error-message">
								Server error: {errorMsg}
							</p>
						</output>
					)
				}
	
				{newWordDomId && (
					<output htmlFor="word definition date uploader">
						<p>
							World uploaded!
						</p>
						<p>
							<a href={`#${newWordDomId}`}>Link to new word</a>
						</p>
					</output>
				)}
			</details>
		</form>
	);
}