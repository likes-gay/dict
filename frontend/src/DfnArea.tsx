import React from "react"

type DfnAreaProps = {
    name: string,
    
}

export default function DfnArea(props: DfnAreaProps) {
    return (
        <>
            <article>
                <header>
                    <button>Upvote</button>
                    <h2>
                        <span role="term" aria-details=""></span>
                    </h2>
                    <a href="">Perma link</a>
                    <button aria-label="Copy perma link"></button>
                    <p>
                        Created by <span></span> at <time></time>
                    </p>
                </header>
                <p role="definition" id="">

                </p>
            </article>
        </>
    )
}