import { useRef, useState	} from "react";
import { NewUploadedWord, UploadWord, Word	} from "./types";
import { createWordDomId } from "./hooks/utils";

type AddNewWordProps = {
	onSubmit?: (newWord: Word) => void
}

export default function	AddNewWord(props: AddNewWordProps) {
	const wordInput	= useRef<HTMLInputElement>(null);
	const descriptionInput = useRef<HTMLTextAreaElement>(null);
	const dateInput	= useRef<HTMLInputElement>(null);
	const uploaderInput	= useRef<HTMLInputElement>(null);
	const [newWordId, setNewWordId] = useState<string>("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		const newWord: NewUploadedWord = await fetch("http://localhost:3000/upload_word", {
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
		<form onSubmit={onSubmit}>
			<h2>Add	New	Word</h2>
			<div>
				<label htmlFor="word">Word:</label>
				<input type="text" id="word" className="input" ref={wordInput} required	/>
			</div>
			
			<div>
				<label htmlFor="definition">Definition</label>
				<textarea id="definition" className="input"	ref={descriptionInput} required></textarea>
			</div>

			<div>
				<label htmlFor="date">Word creation	date:</label>
				<input type="date" id="date" className="input" ref={dateInput} />
			</div>

			<div>
				<label htmlFor="uploader">Uploader:</label>
				<input type="text" id="uploader" className="input" ref={uploaderInput} required	/>
			</div>
			
			<div>
				<button>Submit</button>
			</div>
			{newWordId &&
				<output htmlFor="word definition date uploader">
					World uploaded!	<a href={`#${newWordId}`}>Link to new word</a>
				</output>
			}
		</form>
	)
}