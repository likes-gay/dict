import React, {	useState } from	"react"
import { Word }	from "./types";
import Tooltip from	"./components/Tooltip";

type DfnAreaProps =	{
	word: Word;
};

export default function	DfnArea({ word }: DfnAreaProps)	{
	const creationDateAsDate = new Date(word.creationDate);
	const domId	= `${word.word.replaceAll(/\s/g, "_")}-${word.id}`;
	const descriptionDomId = `${word.word}-description-${word.id}`;

	const [updootPressed, setUpdootPressed]	= useState(false);
	const [isSpeaking, setIsSpeaking] =	useState(false);

	function updootClick() {
		setUpdootPressed(x => !x);
	}

	function speakWord() {
		if(isSpeaking) return;

		window.speechSynthesis.cancel();

		const utterance	= new SpeechSynthesisUtterance(word.word);
		const voices = window.speechSynthesis.getVoices();
		utterance.voice	= voices[0];
		utterance.lang = "en-GB";

		utterance.addEventListener("start",	() => setIsSpeaking(true));
		utterance.addEventListener("end", () => setIsSpeaking(false));

		window.speechSynthesis.speak(utterance);
	}

	return (
		<article id={domId}	className="dfn-area">
			<header>
				<Tooltip toolTipContent={"Updoot"} ariaRelationships="none">
					<button
						onClick={updootClick}
						aria-label={`Updoot	(${word.updoots} ${word.updoots	== 1 ? "updoot": "updoots"})`}
						aria-pressed={updootPressed}
						className="updoot-button"
					>
						^ {word.updoots}
					</button>
				</Tooltip>
				<h2>
					<dfn aria-details={descriptionDomId}>{word.word}</dfn>
				</h2>

				<Tooltip toolTipContent={
					<span role="status">{isSpeaking	? "Speaking" : "Stopped	speaking"}</span>
				}>
					<button
						onClick={speakWord}
						aria-label="Speak word"
						aria-disabled={isSpeaking}
					>
						{isSpeaking	? "Speaking" : "Stopped	speaking"}
					</button>
				</Tooltip>

				<p className="dfn-uploader">
					By <span className="dfn-uploader-word">{word.uploader}</span>
					{" on "}<a className="dfn-perma-link" href={`#${domId}`}>
						<time dateTime={creationDateAsDate.toISOString()}>
							{
								new	Intl.DateTimeFormat("en-GB", {
									year: "numeric",
									month: "long",
									day: "numeric",
									hour: "numeric",
									minute:	"numeric",
									second:	"numeric",
									hour12:	true
								}).format(creationDateAsDate)
							}
						</time>
					</a>
				</p>
			</header>

			<p className="dfn-description" role="definition" id={descriptionDomId}>
				{word.description}
			</p>
		</article>
	)
}