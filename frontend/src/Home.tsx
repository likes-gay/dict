import { Suspense } from "react";
import AddNewWord from "./AddNewWord";
import DfnArea from "./DfnArea";
import { useFetch } from "./hooks/useFetch";
import { AllWordsEndPoint } from "./types";
import Tooltip from "./components/Tooltip";

function Loading() {
    return <progress className="loading"></progress>;
}

export default function Home() {
    const data: AllWordsEndPoint = {
        words: [
            {
                id: 1,
                word: "Hello",
                description: "To say ghi",
                creationDate: new Date().getTime(),
                updoots: 59,
                uploader: "Bobs"
            },
            {
                id: 2,
                word: "Hello",
                description: "To say ghi",
                creationDate: new Date().getTime(),
                updoots: 59,
                uploader: "Bobs"
            },
            {
                id: 3,
                word: "Hello",
                description: "To say ghi",
                creationDate: new Date().getTime(),
                updoots: 59,
                uploader: "Bobs"
            }
        ]
    };

    return (
        <main>
            <header className="page-intro">
                <h1>Word List</h1>
                <p>
                    Total words: <Tooltip toolTipContent={"a"}><span className="tooltip-interest">11</span></Tooltip>
                </p>
            </header>
            <section className="dfn-list">
				<Suspense fallback={<Loading />}>
					{data.words.map(x => (
						<DfnArea
                            word={x}
                            key={x.id}
                        />
					))}
				</Suspense>
            </section>
            <section>
                <AddNewWord />
            </section>
        </main>
    );
}