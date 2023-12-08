import { type } from "os";

export type	PostEndPointResponse = {
	id:	number;
	dailyAffirmation: string;
};

export type	Word =  {
	id:	number;
	word: string;
	description: string;
	creationDate: number; //Unix timestamp
	updoots: number;
	uploader: string;
};

export type	AllWordsEndPoint = {
	words: Word[];
};

//----------------

export type NumOfWords = {
	totalWords: number;
};

export type GetAllIds = Word[];

export type GetRangeOfWords = {
	dictWords: Word[];
	max: number;
};

export type	UploadWord = {
	word: string;
	description: string;
	creationDate: number;
	uploader: string;
};

export type NewUploadedWord = Word;