import React from "react";
import ReactDOM from "react-dom";
import { useFetch } from "./hooks/utils";
import AddNewWord from "./AddNewWord";

type PostEndPointBody = {
    word: string;
    creationDate: string;
    uploader: string;
};

type PostEndPointResponse = {
    id: number;
    dailyAffirmation: string;
};

type AllWordsEndPoint = {
    words: {
        id: number;
        word: string;
        description: string;
        creationDate: number; //Unix timestamp
        updoots: number;
        uploader: string;
    }[];
};

export default function Home() {
    const data = useFetch;

    return (
        <main>
            <h1>Word List</h1>

            <p>
                Which site is better?
            </p>
            <button></button>
            <button></button>

            <section>
                <AddNewWord />
            </section>
        </main>
    );
}

ReactDOM.render(<Home />, document.getElementById("root"));