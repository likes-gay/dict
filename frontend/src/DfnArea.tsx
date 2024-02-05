import { useState } from "react";
import { UpdateUpdoot, UpdootStates, Word }	from "./types";
import Tooltip from "./components/Tooltip";
import { AudioIcon, LinkIcon, UpdootIcon, createDescriptionDomId, createWordDomId } from "./hooks/utils";
import useRelativeTime from "./hooks/useRelativeTime";
import WordDescription from "./WordDescription";

type DfnAreaProps =	{
	word: Word;
};

type UpdootButtonsProps = {
	word: Word;
	onUpdootUpdate: (updatedWord: Word) => void
}

function UpdootButtons({ word, onUpdootUpdate: updateState }: UpdootButtonsProps) {
	const [updootState, setUpdootState] = useState<UpdootStates>(localStorage.getItem(`${word.id}-updootState`) as UpdootStates || "none");

	async function handleUpdootClick(state: UpdootStates) {
		setUpdootState(state);

		if(state == "none")
			localStorage.removeItem(`${word.id}-updootState`);
		else
			localStorage.setItem(`${word.id}-updootState`, state);

		const updatedWord: Word = await fetch("/api/update_updoot", {
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: word.id,
				updootState: state,
				prevUpdootState: updootState,
			} as UpdateUpdoot),
			method: "POST",
		}).then(x => x.json());
		
		updateState(updatedWord);
	}

	return (
		<div className="updoot-info">
			<Tooltip toolTipContent={"Updoot"} ariaRelationships="none">
				<button
					onClick={() => handleUpdootClick(updootState == "up" ? "none" : "up")}
					aria-label={`Updoot (${word.updoots} ${word.updoots == 1 ? "updoot" : "updoots"})`}
					aria-pressed={updootState == "up"}
					className={"updoot-button"}
				>
					<UpdootIcon />
				</button>
			</Tooltip>
			<Tooltip toolTipContent={"Total"}>
				<div className="total">{word.updoots - word.downdoots}</div>
			</Tooltip>
			<Tooltip toolTipContent={"Downdoot"} ariaRelationships="none">
				<button
					onClick={() => handleUpdootClick(updootState == "down" ? "none" : "down")}
					aria-label={`Downdoot (${word.downdoots} ${word.downdoots == 1 ? "downdoot" : "downdoots"})`}
					aria-pressed={updootState == "down"}
					className={"downdoot-button"}
				>
					<UpdootIcon />
				</button>
			</Tooltip>
		</div>
	);
}

export default function	DfnArea({ word }: DfnAreaProps) {
	const [wordData, setWordData] = useState(word);
	const [isSpeaking, setIsSpeaking] =	useState(false);
	
	const creationDateAsDate = new Date(wordData.creationDate);
	const domId	= createWordDomId(wordData);
	const descriptionDomId = createDescriptionDomId(wordData);
	
	const relativeTime = useRelativeTime(creationDateAsDate);

	function speakWord() {
		if(isSpeaking) {
			window.speechSynthesis.cancel();
			return;
		};

		window.speechSynthesis.cancel();

		const utterance	= new SpeechSynthesisUtterance(wordData.word);
		const voices = window.speechSynthesis.getVoices();
		utterance.voice	= voices[0];
		utterance.lang = "en-GB";

		utterance.addEventListener("start", () => setIsSpeaking(true));
		utterance.addEventListener("end", () => setIsSpeaking(false));

		window.speechSynthesis.speak(utterance);
	}

	return (
		<article id={domId} className="dictionary-entry">
			<header className="header-section">
				<h2 className="word">
					<dfn aria-details={descriptionDomId}>{wordData.word}</dfn>
				</h2>

				<div className="interactive-metadata">
					<UpdootButtons word={wordData} onUpdootUpdate={setWordData} />

					<Tooltip toolTipContent={"Perma link"} ariaRelationships="none">
						<a aria-label={`Perma link for ${wordData.word}`} className="permalink" href={`#${domId}`}>
							<LinkIcon />
						</a>
					</Tooltip>

					<Tooltip toolTipContent={isSpeaking ? "Cancel speaking" : "Speak word"} ariaRelationships="none">
						<button
							onClick={speakWord}
							className="speak-button"
							aria-label={isSpeaking ? "Cancel speaking" : "Speak word"}
							aria-disabled={isSpeaking}
						>
							<AudioIcon />
						</button>
					</Tooltip>
				</div>
			</header>

			<div className="definition-section">
				<WordDescription
					description={wordData.description}
				/>
			</div>

			<footer className="footer-section">
				<p>
					Uploaded by:
					<span className="uploader-word">
						{wordData.isRobot &&
							<Tooltip toolTipContent={"This word was uploaded by a robot"}>
								<span aria-label="Robot" aria-roledescription="emoji" role="img">🤖</span>	
							</Tooltip>}
						{wordData.uploader}
					</span>
				</p>
				<p>{wordData.id}</p>
				<p>
					Creation date:
					<Tooltip
						toolTipContent={new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							second: "numeric",
							hour12: true,
						}).format(creationDateAsDate)}
					>
						<time className="new-line" dateTime={creationDateAsDate.toISOString()}>
							{relativeTime}
						</time>
					</Tooltip>
				</p>
			</footer>
		</article>
	);
}