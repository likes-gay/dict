import { useEffect, useState } from "react";
import AddNewWord from "./AddNewWord";
import DfnArea from	"./DfnArea";
import { GetAllWordsOrderByOptions, GetAllWordsSortByOptions, Word } from "./types";
import Tooltip from	"./components/Tooltip";
import Combobox from "./components/Combobox";

export default function	Home() {
	const [allWords, setAllWords] = useState<Word[]>([]);
	const [isFirstLoading, setIsFirstLoading] = useState(true);

	useEffect(() => {
		(async () => {
			await GetAllWords(true);
			setIsFirstLoading(false);
		})();
	}, []);

	useEffect(() => {
		const orginalHash = location.hash.substring(1);
		
		if(!orginalHash) return;
		
		location.hash = "";
		location.hash = orginalHash;
	}, [isFirstLoading]);

	async function GetAllWords(reloadWords?: boolean) {
		const searchParams = new URLSearchParams(location.search);

		const sortby = searchParams.get("sortby") as GetAllWordsSortByOptions || "totaldoots";
		const orderby = searchParams.get("orderby") as GetAllWordsOrderByOptions || "desc";

		if(reloadWords) {
			const json: Word[] = await fetch(`/api/get_all_words?sortby=${sortby}&orderby=${orderby}`).then(x => x.json());
	
			setAllWords(json);
			return;
		}
		const isDesc = orderby == "desc";

		if(sortby == "totaldoots") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) =>
					isDesc
						? a.updoots - a.downdoots - (b.updoots - b.downdoots)
						: b.updoots - b.downdoots - (a.updoots - a.downdoots),
				),
			);
		} else if(sortby == "id") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) => (isDesc ? a.id - b.id : b.id - a.id)),
			);
		} else if(sortby == "updoots") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) => (isDesc ? a.updoots - b.updoots : b.updoots - a.updoots)),
			);
		} else if(sortby == "downdoots") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) => (isDesc ? a.downdoots - b.downdoots : b.downdoots - a.downdoots)),
			);
		} else if(sortby == "date") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) =>
					isDesc ? a.creationDate - b.creationDate : b.creationDate - a.creationDate,
				),
			);
		} else if(sortby == "alphabet") {
			setAllWords((prevWords) =>
				prevWords.toSorted((a, b) =>
					isDesc ? a.word.localeCompare(b.word) : b.word.localeCompare(a.word),
				),
			);
		}

		if(orderby)
			setAllWords(x => x.toReversed());
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
					onSubmitFinished={() => GetAllWords(true)}
				/>
			</section>
			<main>
				<search className="filter-area">
					<div>
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
					</div>

					<div>
						<label htmlFor="order-by">Order by:</label>
						<Combobox
							id="order-by"
							urlKey="orderby"
							options={[
								{
									content: "Descending",
									urlValue: "desc",
								},
								{
									content: "Ascending",
									urlValue: "asc",
								},
							]}
							onUpdate={() => GetAllWords()}
						/>
					</div>
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
					<Tooltip toolTipContent={"GitHub"} ariaRelationships="none" removeTabIndex={true}>
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
				<p style={{
					fontSize: "0.8em",
					color: "#88811",
				}}>Version: {process.env.VERSION}</p>
			</footer>
		</>
	);
}