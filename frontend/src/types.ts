export type	Word =  {
	id:	number;
	word: string;
	description: string;
	creationDate: number;
	updoots: number;
	downdoots: number;
	uploader: string;
};

export type NumOfWords = {
	totalWords: number;
};

export type GetRangeOfWords = {
	dictWords: Word[];
	max: number;
};

export type	UploadWord = {
	word: string;
	description: string;
	creationDate: number;
	uploader: string;
	isRobot: boolean;
};

export type	UploadWordResponse = Word | {
	detail: string;
};

export type UpdootStates = "up" | "down" | "none";

export type UpdateUpdoot = {
	id:	number;
	updootState: UpdootStates;
	prevUpdootState: UpdootStates;
};

export type GetAllWordsSortByOptions = "totaldoots" | "updoots" | "downdoots" | "id" | "date" | "alphabet";