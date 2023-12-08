import time
from typing	import List, Union
from typing_extensions import Annotated
from fastapi import	Cookie, FastAPI, HTTPException,	Query, Request, Response
from fastapi.middleware.cors import	CORSMiddleware
from numpy import array
from pydantic import BaseModel
import json
from random_word import	RandomWords
from random	import choice

app	= FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["GET", "POST"],
	allow_headers=["Content-Type"],
)

# ------------------------------------------

def	read_json():
	with open("data.json", "r")	as f:
		return json.loads(f.read())

# -------------------------------------------

class UpdateUpdoot(BaseModel):
	id:	int
	isUpdooted:	bool

class UploadWordFormat(BaseModel):
	word: str
	description: str
	creationDate: int
	uploader: str

# -------------------------------------------

#@app.middleware("http")
#async def session_cookie(req: Request, cookie: Cookie(default=None)):
#	print(cookie)

# -------------------------------------------

@app.get("/", status_code=418)
async def root():
	return {"I'm a": "teapot"}

# -------------------------------------------

@app.get("/num_of_words")
async def num_of_words():
	data = read_json()
	count_of_words = len(data)
	return {"totalWords": count_of_words}

@app.get("/get_word/{id}")
async def get_word(id: int):
	data = read_json()
	for	word in data:
		if word["id"] == id:
			return word
	raise HTTPException(status_code=404, detail="Item not found	lol")

@app.post("/upload_word", status_code=200)
async def upload_word(newWord: UploadWordFormat):
	with open("data.json", "r+") as f:
		file_data =	read_json()
		newWordDict = newWord.model_dump()
		
		newWordDict["id"] = file_data[-1]["id"] + 1
		file_data.append(newWordDict)
		
		if not newWordDict["creationDate"]:
			newWordDict["creationDate"] = int(time.time())
		
		f.seek(0)
		f.write(json.dumps(file_data))
		f.truncate()
		return newWordDict

@app.post("/update_updoot")
async def update_updoot(req: UpdateUpdoot):
	data = read_json()
	for	word in data:
		if word["id"] == req.id:
			if req.isUpdooted:
				word["updoots"]	+= 1
			else:
				word["updoots"]	-= 1
			
			with open("data.json", "w")	as f:
				f.write(json.dumps(data))
			break

@app.get("/get_random_word")
async def get_random_dctionary_word():
	return {
		"word":	choice(read_json()),
		"realRandomWord": RandomWords().get_random_word()
	}

@app.get("/get_all_words")
async def get_all_words(order_by: str = "id", dir: str = "as"): #Query param validation not working here #Annotated[Union[str, None], Query()] = ["id", "updoot"]
	data = read_json()
	
	valid_order_by = "id"

	if order_by in ["id", "updoot", "updoots"]:
		valid_order_by = order_by
		if order_by == "updoot":
			valid_order_by = "updoots"
	else:
		raise HTTPException(status_code=400, detail="Invalid query params")
	
	return sorted(data,	key=lambda x: x[valid_order_by])
	

@app.get("/all_words_unsorted")
def all_words():
	data = read_json()
	return(data)

@app.get("/get_range_of_words")
async def get_range_of_words(offset: int = 0, size: int = 5):
	data = read_json()

	if size < 1:
		raise HTTPException(status_code=400, detail="Size cannot be less than 1")
					  
	if offset < 0:
		raise HTTPException(status_code=400, detail="Offset cannot be less than 0")

	if offset > len(data):
		raise HTTPException(status_code=400, detail="Offset cannot be greater than the length the data")

	return {
		"dictWords": data[offset : offset + size],
		"max": len(all_words())
	}
 
@app.get("/lookup_id_of_word/{word}")
async def lookup_id(word: str):
	data = read_json()
	
	for line in data:
		if line["word"].lower() == word.lower():
			return {
				"id": line["id"]
			}
	raise HTTPException(status_code=404, detail="Item not found lol")