import { Word } from "../types";

export function createWordDomId(word: Word) {
	return `${word.word.replaceAll(/\s/g, "_")}-${word.id}`;
}