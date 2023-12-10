import React, {	useState } from	"react";
import { Word }	from "./types";
import Tooltip from	"./components/Tooltip";
import { createDescriptionDomId, createWordDomId } from "./hooks/utils";

type DfnAreaProps =	{
	word: Word;
};

export default function	DfnArea({ word }: DfnAreaProps)	{
	const creationDateAsDate = new Date(word.creationDate);
	const domId	= createWordDomId(word);
	const descriptionDomId = createDescriptionDomId(word);

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
		<article id={domId} className="dictionary-entry">
			<header className="header">
				<div className="header-begin">
					<h2 className="word">
						<dfn aria-details={descriptionDomId}>{word.word}</dfn>
					</h2>
				</div>

				<div className="metadata-section buttons-metadata">
					<Tooltip toolTipContent={"Updoot"} ariaRelationships="none">
						<button
							onClick={updootClick}
							aria-label={`Updoot (${word.updoots} ${word.updoots === 1 ? "updoot" : "updoots"})`}
							aria-pressed={updootPressed}
							className="updoot-button"
						>
							Arrow icon
						</button>
					</Tooltip>
					<Tooltip toolTipContent={"Permalink"} ariaRelationships="none">
						<a aria-label="Permalink" className="permalink" href={`#${domId}`}>
							🔗
						</a>
					</Tooltip>
					<Tooltip toolTipContent={<span role="status">{isSpeaking ? "Speaking" : "Stopped speaking"}</span>}>
						<button
							onClick={speakWord}
							className="speak-button"
							aria-label="Speak word"
							aria-disabled={isSpeaking}
						>
							{isSpeaking ? "Speaking" : "Stopped speaking"}
						</button>
					</Tooltip>
				</div>
			</header>

			<div className="definition-section">
				<h3 className="definition-heading">Definition:</h3>
				<p className="definition" role="definition" id={descriptionDomId}>
					{word.description}
				</p>
			</div>

			<footer className="metadata metadata-section">
				<p className="uploader">
					Uploaded by: <span className="uploader-word">{word.uploader}</span>
				</p>
				<span className="separator">|</span>
				<p className="date">
					Date:{" "}
					<time dateTime={creationDateAsDate.toISOString()}>
						{new Intl.DateTimeFormat("en-GB", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "numeric",
							minute: "numeric",
							second: "numeric",
							hour12: true,
						}).format(creationDateAsDate)}
					</time>
				</p>
			</footer>
		</article>
	);
}