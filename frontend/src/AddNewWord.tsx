import { useRef } from "react";
import { UploadWord } from "./types";

export default function AddNewWord() {
    const wordInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLTextAreaElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);
    const uploaderInput = useRef<HTMLInputElement>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const newWord = await fetch("http://localhost:3000/api/upload_word", {
            body: JSON.stringify({
                word: wordInput.current!.value,
                description: descriptionInput.current!.value,
                creationDate: (dateInput.current!.valueAsDate || new Date()).getTime(),
                uploader: uploaderInput.current!.value
            } as UploadWord),
            method: "POST"
        });
        const newWordJson = await newWord.json();
    }

    return (
        <form onSubmit={onSubmit}>
            <h2>Add New Word</h2>
            <label htmlFor="word">Word:</label>
            <input type="text" id="word" className="input" ref={wordInput} required />
            
            <label htmlFor="definition">Definition</label>
            <textarea id="definition" className="input" ref={descriptionInput} required></textarea>

            <label htmlFor="date">Word creation date:</label>
            <input type="date" id="date" className="input" ref={dateInput} />

            <label htmlFor="uploader">Uploader:</label>
            <input type="text" id="uploader" className="input" ref={uploaderInput} required />
            
            <button>Submit</button>
            <output>
                World uploaded! <a href="#">Link to new word</a>
            </output>
        </form>
    )
}