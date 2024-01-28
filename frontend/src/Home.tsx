import { useEffect, useState } from "react";
import AddNewWord from "./AddNewWord";
import DfnArea from	"./DfnArea";
import { Word } from "./types";
import Tooltip from	"./components/Tooltip";
import Combobox from "./components/Combobox";

export default function	Home() {
	const [allWords, setAllWords] = useState<Word[]>([]);
	const [isFirstLoading, setFirstIsLoading] = useState(true);

	useEffect(() => {
		(async () => {
			await GetAllWords();
			setFirstIsLoading(false);
		})();
	}, []);

	useEffect(() => {
		const orginalHash = location.hash.substring(1);
		
		if(!orginalHash) return;
		
		location.hash = "";
		location.hash = orginalHash;
	}, [isFirstLoading]);

	async function GetAllWords() {
		const searchParams = new URLSearchParams(location.search);

		const json: Word[] = await fetch(
			`/api/get_all_words?sortby=${searchParams.get("sortby") || "id"}&orderby=${searchParams.get("orderby") || "asc"}`,
		).then(x => x.json());

		setAllWords(json);
	}

	return (
		<>
			<header	className="page-intro">
				<h1>Dict Word List</h1>
				<p>
					Total words: {isFirstLoading ? <progress className="loading-text" /> : allWords.length}
				</p>
			</header>
			<section className="add-new-word">
				<AddNewWord
					onSubmitFinished={() => GetAllWords()}
				/>
			</section>
			<main>
				<search className="filter-area">
					<label htmlFor="sort-by">Sort by:</label>
					<Combobox
						id="sort-by"
						urlKey="sortby"
						options={[
							{
								content:"Total doots",
								urlValue: "totaldoots",
							},
							{
								content: "Updoots",
								urlValue: "updoots",
							},
							{
								content: "Downdoots",
								urlValue: "downdoots",
							},
							{
								content: "Id",
								urlValue: "id",
							},
							{
								content: "Date",
								urlValue: "date",
							},
							{
								content: "Alphabet",
								urlValue: "alphabet",
							},
						]}
						onUpdate={() => GetAllWords()}
					/>

					<label htmlFor="order-by">Order by:</label>
					<Combobox
						id="order-by"
						urlKey="orderby"
						options={[
							{
								content: "Ascending",
								urlValue: "asc",
							},
							{
								content: "Descending",
								urlValue: "desc",
							},
						]}
						onUpdate={() => GetAllWords()}
					/>
				</search>
				{isFirstLoading && <progress className="loading" />}
				{allWords.length ?
					<div className="list">
						{allWords.map(x => (
							<DfnArea
								word={x}
								key={x.id}
							/>
						))}
					</div> : undefined
				}
				{!isFirstLoading ?
					<p className="amount-words-shown">
						{allWords.length} out of {allWords.length} {allWords.length == 1 ? "word" : "words"} shown!
					</p> : undefined
				}
			</main>
			<footer className="footer">
				<p>
					<Tooltip toolTipContent={"GitHub"} ariaRelationships="none">
						<img src="/github-logo.svg" className="github-logo" alt="GitHub" />
					</Tooltip>
					We are <a href="https://github.com/likes-gay/dict">open source</a>!
				</p>
				<p>
					View our <a href="/docs">API docs</a>.
				</p>
				<address>
					<p>
						Website created by <a href="https://github.com/YummyBacon5" rel="author">YummyBacon5</a> and <a href="https://github.com/Zoobdude" rel="author">Zoobdude</a>.
					</p>
				</address>
			</footer>
		</>
	);
}