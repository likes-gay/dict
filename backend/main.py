from enum import Enum
import time

from fastapi import	FastAPI, HTTPException,	Query
from fastapi.middleware.cors import	CORSMiddleware
from pydantic import BaseModel

from random_word import	RandomWords
from random	import choice

from tinydb	import TinyDB, Query
from tinydb.operations import increment

from os import getenv

db = TinyDB("db_data.json")
app	= FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["GET", "POST", "DELETE"],
	allow_headers=["Content-Type"],
)

# -------------------------------------------

class UpdateUpdoot(BaseModel):
	id:	int
	isUpdooted:	bool

class UploadWordFormat(BaseModel):
	word: str
	description: str
	creationDate: int
	uploader: str

class DeleteWord(BaseModel):
	id: int
	secretKey: str

class DirEnum(str, Enum):
    desc = "desc"
    asc = "asc"

# -------------------------------------------

#@app.middleware("http")
#async def session_cookie(req: Request,	cookie:	Cookie(default=None)):
#	print(cookie)

# -------------------------------------------

@app.get("/", status_code=418)
async def root():
	return {"I'm a": "teapot"}

# -------------------------------------------

@app.get("/num_of_words")
async def count_of_words():
	return {"totalWords": len(db)}

@app.post("/upload_word", status_code=200)
async def upload_new_word(newWord: UploadWordFormat):
	#check if word is empty
	if newWord.word	== "":
		raise HTTPException(status_code=400, detail="Word cannot be empty")

	#check if word already exists
	if newWord.word	in [entry["word"] for entry	in db.all()]:
		raise HTTPException(status_code=400, detail="Word already exists")
	
	if newWord.description == "":
		raise HTTPException(status_code=400, detail="Description cannot	be empty")

	if not newWord.uploader:
		uploader = "Anonymous"
	else:
		uploader = newWord.uploader
	
	if not newWord.creationDate:
		newWord.creationDate = int(time.time())
	
	record = {
			"id": len(db),
			"word":	newWord.word,
			"description": newWord.description,
			"creationDate":	newWord.creationDate,
			"uploader":	uploader.lower(),
			"updoots": 0
		}
	
	db.insert(record)

	return(record)

@app.delete("/delete_word/{id}")
async def delete(req: DeleteWord):
	if req.secretKey != getenv("SECRET_KEY"):
		raise HTTPException(403, detail="Unauthorised, invalide secret key")
	
	
		


@app.post("/update_updoot")
async def update_words_updoot_count(req: UpdateUpdoot):
	if req.isUpdooted == None:
		raise HTTPException(status_code=400, detail="isUpdooted	cannot be None")

	if req.id == None:
		raise HTTPException(status_code=400, detail="id	cannot be None")
	
	if req.isUpdooted == True:
		db.update(increment("updoots"),	Query().id == req.id)
	
	response = db.search(Query().id	== req.id)
	return(response[0])
		
@app.get("/get_word/{id}")
async def get_word_by_ID(id: int):
	response = db.search(Query().id	== id)
	
	if response:
		return response[0]
	else:
		raise HTTPException(status_code=404, detail="Item not found	lol")

@app.get("/get_all_words")
async def get_all_words(order_by: str = "id", dir: DirEnum = "desc"):
	valid_order_by = "id"

	if order_by	in ["id", "updoot",	"updoots"]:
		valid_order_by = order_by
		if order_by	== "updoot":
			valid_order_by = "updoots"
	else:
		raise HTTPException(status_code=400, detail="Invalid query params")
	
	if dir == "asc":
		return sorted(db.all(),	key=lambda x: x[valid_order_by])

	elif dir == "desc":
		return sorted(db.all(),	key=lambda x: x[valid_order_by], reverse=True)
	
	return sorted(db.all(),	key=lambda x: x[valid_order_by])


@app.get("/get_range_of_words")
async def get_range_of_words(offset: int = 0, size:	int	= 5):
	data = db.all()

	if size	< 1:
		raise HTTPException(status_code=400, detail="Size cannot be less than 1")
						
	if offset <	0:
		raise HTTPException(status_code=400, detail="Offset	cannot be less than	0")

	if offset >	len(data):
		raise HTTPException(status_code=400, detail="Offset	cannot be greater than the length the data")

	return {
		"dictWords": data[offset : offset +	size],
		"max": len(all_words())
	}
	
@app.get("/lookup_id/{word}")
async def lookup_id_of_word(word: str):
	response = db.search(Query().word == word)
	if response:
		return {"id": response[0]["id"]}

	else:
		raise HTTPException(status_code=404, detail="Item not found	lol")


@app.get("/get_uploaders_posts/{uploader}")
async def get_all_of_a_uploaders_posts(uploader: str):
	response = db.search(Query().uploader == uploader.lower())

	return(response)


@app.get("/get_random_word")
async def get_a_random_word_and_one_from_the_english_dictionary():
	return {
		"word":	choice(db.all())["word"],
		"realRandomWord": RandomWords().get_random_word()
	}