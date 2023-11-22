from fastapi import FastAPI

app = FastAPI()

@app.get("/get_all_words")
def return_all_words():
    return {"Hello": "World!!!!"}