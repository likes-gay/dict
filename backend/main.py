from typing import List, Union
from typing_extensions import Annotated
from fastapi import FastAPI, HTTPException, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from random_word import RandomWords
from random import choice

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5500"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

# ------------------------------------------

def read_json():
    with open("data.json", "r") as f:
        return json.loads(f.read())

# -------------------------------------------

class UpdateUpdoot(BaseModel):
    id: int
    isUpdooted: bool

class UploadWordFormat(BaseModel):
    word: str
    description: str
    creationDate: int
    uploader: str

# -------------------------------------------

@app.get("/api", status_code=418)
async def root():
    return {"I'm a": "teapot"}

# -------------------------------------------

@app.get("/api/num_of_words")
async def num_of_words():
    data = read_json()
    count_of_words = len(data)
    return {"totalWords": count_of_words}

@app.get("/api/get_word/{id}")
async def get_word(id: int):
    data = read_json()
    for word in data:
        if word["id"] == id:
            return word
    raise HTTPException(status_code=404, detail="Item not found lol")

@app.post("/api/upload_word", status_code=204)
async def upload_word(req: UploadWordFormat, res: Response):
    with open("data.json", "r+") as f:
        file_data = json.loads(f.read())
        file_data.append(req)
        f.write(json.dumps(file_data))

@app.post("/api/update_updoot")
async def update_updoot(req: UpdateUpdoot):
    data = read_json()
    for word in data:
        if word["id"] == req.id:
            if req.isUpdooted:
                word["updoots"] += 1
            else:
                word["updoots"] -= 1
            
            with open("data.json", "w") as f:
                f.write(json.dumps(data))
            break

@app.get("/api/get_random_word")
async def get_random_dctionary_word():
    return {
        "word": choice(read_json()),
        "realRandomWord": RandomWords().get_random_word()
    }

@app.get("/api/get_all_IDs")
async def ordered_list_of_ID(order_by: Annotated[Union[str, None], Query()] = ["id", "updoot"], dir: str = "as"): #Query param validation not working here
	data = read_json()
    
	valid_order_by = "id"
    
	if order_by == "id" or order_by == "updoots":
		valid_order_by = order_by
		if order_by == "updoot":
			valid_order_by = "updoots"
	else:
		raise HTTPException(status_code=400, detail="Invalid query params")
    
	return sorted(data, key=lambda x: x[valid_order_by])
	
	
@app.get("/api/all_words")
async def all_words():
    data = read_json()
    return(data)