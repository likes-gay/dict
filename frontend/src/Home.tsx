import { useEffect, useState } from "react";
import AddNewWord from "./AddNewWord";
import DfnArea from	"./DfnArea";
import { Word } from "./types";
import Tooltip from	"./components/Tooltip";

export default function	Home() {
	const [allWords, setAllWords] = useState<Word[]>([]);

	useEffect(() => {
		GetAllWords();
	}, []);

	useEffect(() => {
		if(!allWords.length || !location.hash) return;

		document.getElementById(
			location.hash.substring(1)
		)?.focus();
	}, [allWords]);

	async function GetAllWords() {
		const json: Word[] = await fetch("/api/get_all_words?orderby=id").then(x => x.json());
		setAllWords(json);
	}

	return (
		<>
			<header	className="page-intro">
				<h1>Dict Word List</h1>
				<p>
					Total words: {allWords?.length || <progress className="loading-text" />}
				</p>
			</header>
			<section className="add-new-word">
				<AddNewWord
					onSubmit={GetAllWords}
				/>
			</section>
			<main className="list">
				{!allWords.length && <progress className="loading" />}
				{allWords.map(x => (
					<DfnArea
						word={x}
						key={x.id}
					/>
				))}
				{allWords.length ?
					<p className="amount-words-shown">
						{allWords?.length} out of {allWords?.length} words shown!
					</p> : undefined
				}
			</main>
			<footer className="footer">
				<p>
					<Tooltip toolTipContent={"GitHub"} ariaRelationships="none">
						<img src="/github-logo.svg" className="github-logo" alt="GitHub" />
					</Tooltip>
					We are <a href="https://github.com/Zoobdude/dict">open source</a>!
				</p>
				<p>
					View our <a href="/docs">API docs</a>.
				</p>
				<address>
					Website created by <a href="https://github.com/Yummy_Bacon5" rel="author">Yummy_Bacon5</a> and <a href="https://github.com/Zoobdude" rel="author">Zoobdude</a>
				</address>
			</footer>
		</>
	);
}