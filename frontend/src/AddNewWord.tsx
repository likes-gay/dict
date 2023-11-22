import React from "react";

export default function AddNewWord() {
    async function FormSubmit() {
        await fetch()
    }

    return (
        <>
            <h2>Add New Word</h2>
            <label htmlFor=""></label>
            <input type="text" />
            <label htmlFor=""></label>
            <textarea name="" id=""></textarea>
            <button
                onClick={FormSubmit}
            >Submit</button>
        </>
    )
}