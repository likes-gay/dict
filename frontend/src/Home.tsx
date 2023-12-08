import { Suspense, useEffect, useRef, useState } from "react";
import AddNewWord from "./AddNewWord";
import DfnArea from	"./DfnArea";
import { useFetch }	from "./hooks/useFetch";
import { AllWordsEndPoint, GetAllIds, GetRangeOfWords, NumOfWords, Word } from "./types";
import Tooltip from	"./components/Tooltip";

function Loading() {
	return <progress className="loading"></progress>;
}

export default function	Home() {
	const [allWords, setAllWords] = useState<Word[]>([]);;

	useEffect(() => {
		(async () => {
			const json: Word[] = await fetch("http://localhost:300/get_all_words?orderby=id").then(x => x.json());
			console.log(json);
			setAllWords(json);
		})();
	}, []);

	useEffect(() => {
		if(!allWords?.length) return;

		document.getElementById(
			location.hash.substring(1)
		)!.focus();
	}, [allWords]);

	//useEffect(() => {
	//	const signal = new AbortController();
	//
	//	if(max !== 0 && currentWords.length >= max) return;
	//
	//	(async () => {
	//		const data: GetRangeOfWords = await fetch(`http://localhost:3000/get_range_of_words?offset=${offset * 5}&size=5`, {
	//			signal: signal.signal
	//		}).then(x => x.json());
	//
	//		setMax(data.max);
	//		setCurrentWords(x => ([...x, ...data.dictWords]));
	//	})();
	//
	//	return () => signal.abort();
	//}, [offset]);
	
	//useEffect(() => {
	//	const observer = new IntersectionObserver((entries) => {
	//		console.log(entries[0].isIntersecting)
	//		if(entries[0].isIntersecting) {
	//			setOffset(x => x + 1);
	//		}
	//	}, { threshold: 1 });
	//
	//	if(target.current) {
	//		observer.observe(target.current);
	//	}
	//
	//	return () => {
	//		if (target.current) {
	//			observer.unobserve(target.current);
	//		}
	//	};
	//}, [target]);

	async function GetAllWords() {
		const json: Word[] = await fetch("http://localhost:300/get_all_words?orderby=id").then(x => x.json());

		console.log(json);

		setAllWords(json);
	}

	return (
		<main>
			<header	className="page-intro">
				<h1>Word List</h1>
				<p>
					Total words: {allWords?.length || <progress className="loading-text"></progress>}
				</p>
			</header>
			<section className="add-new-word">
				<AddNewWord
					onSubmit={GetAllWords}
				/>
			</section>
			<section className="dfn-list">
				<Suspense fallback={<Loading />}>
					{allWords?.map(x => (
						<DfnArea
							word={x}
							key={x.id}
						/>
					))}
				<p>
					{allWords?.length} out of {allWords?.length} words shown!
				</p>
				</Suspense>
			</section>
			<Loading />
		</main>
	);
}