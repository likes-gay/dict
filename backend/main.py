from os import getenv
from random import choice
from enum import Enum
import time
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from random_word import RandomWords

from tinydb import TinyDB, where
from tinydb.operations import increment, decrement

load_dotenv()

db = TinyDB("dict-data/dict_db.json", create_dirs=True, separators=(",", ":"))
app = FastAPI(
	title="Dict Backend",
	summary="Backend for the Dict project",
	version=getenv("VERSION"),
)

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_methods=["GET", "POST", "DELETE"],
	allow_headers=["Content-Type"],
	allow_origin_regex=r"^/api.*$", # Only allow CORS on /api
)

# -------------------------------------------
# Prevent breaking changes to the db

# Add the new keys into the database. So old data doesn't break everything
db.update({"downdoots": 0}, ~ where("downdoots").exists())
db.update({"isRobot": False}, ~ where("isRobot").exists())

# -------------------------------------------
# Input models

class UpdootEnum(str, Enum):
	UP = "up"
	DOWN = "down"
	NONE = "none"

class UpdateUpdoot(BaseModel):
	id: int
	updootState: UpdootEnum
	prevUpdootState: UpdootEnum

class UploadWordFormat(BaseModel):
	word: str
	description: str
	creationDate: int
	uploader: str
	isRobot: bool

class DeleteWord(BaseModel):
	id: int
	secretKey: str

class GetWordParam(BaseModel):
	word_id: int

class DirEnum(str, Enum):
	DESC = "desc"
	ASC = "asc"

class SortByEnum(str, Enum):
	TOTALDOOTS = "totaldoots"
	UPDOOTS = "updoots"
	DOWNDOOTS = "downdoots"
	ID = "id"
	CREATION_DATE = "date"
	ALPHABETICAL = "alphabet"

# -------------------------------------------
# Output models

class Count(BaseModel):
	count: int
 
class Record(BaseModel):
	id: int
	word: str
	description: str
	creationDate: int
	uploader: str
	updoots: int
	downdoots: int
	isRobot: bool

class RandomWord(BaseModel):
	word: Record
	realRandomWord: str

class RangeOfWords(BaseModel):
	dictWords: list[Record]
	max: int

# -------------------------------------------

# Remove trailing slashes
@app.middleware("http")
async def remove_trailing_slash(request: Request, call_next):
	if request.url.path != "/" and request.url.path.endswith("/"):
		return RedirectResponse(request.url.path.rstrip("/") or "/", 301)

	return await call_next(request)

# -------------------------------------------

@app.get("/api", status_code=418)
async def check_if_api_is_working():
	pass


@app.get("/api/num_of_words", response_model=Count)
async def count_of_words():
	return {"count" : len(db)}


@app.post("/api/upload_word", response_model=Record, status_code=201)
async def upload_a_new_word(new_word: UploadWordFormat):
	# Trim string values
	word = new_word.word.strip()
	description = new_word.description.strip()
	uploader = new_word.uploader.strip()

	# Check if word is empty
	if word == "":
		raise HTTPException(status_code=400, detail="Word after trimming of whitespace cannot be empty")

	# Check if word already exists
	if db.search(where("word") == word):
		raise HTTPException(status_code=400, detail="Word already exists")

	if description == "":
		raise HTTPException(status_code=400, detail="Description cannot be empty")

	record = {
		"word": word,
		"description": description,
		"creationDate": new_word.creationDate or int(time.time()),
		"uploader": uploader or "Unknown",
		"updoots": 0,
		"downdoots": 0,
		"isRobot": new_word.isRobot,
	}

	# Keep the id same as the doc_id
	word_id = db.insert(record)
	
	new_word = {
		**record,
		"id": word_id,
	}

	db.update({"id": word_id}, doc_ids=[word_id])

	return new_word

@app.delete("/api/delete_word", status_code=204)
async def delete_a_word(req: DeleteWord):
	if req.secretKey != getenv("SECRET_KEY"):
		raise HTTPException(status_code=403, detail="Unauthorised, invalid secret key")

	# Check if the word exists
	word = db.get(where("id") == req.id)
	if not word:
		raise HTTPException(status_code=404, detail="Word does not exist")

	# Delete word from database
	db.remove(doc_ids=[word.doc_id])

@app.post("/api/update_updoot", response_model=Record, status_code=201)
async def update_words_updoot_count(req: UpdateUpdoot):
	word_id = req.id
	prevUpdootState = req.prevUpdootState.value + "doots"

	if not db.contains(where("id") == word_id):
		raise HTTPException(status_code=404, detail="Word does not exist")

	if req.prevUpdootState == req.updootState:
		raise HTTPException(status_code=400, detail="Cannot update the same updoot state")

	entry = db.get(where("id") == word_id)
	if req.prevUpdootState != UpdootEnum.NONE:
		if entry[prevUpdootState] > 0:
			db.update(decrement(prevUpdootState), where("id") == word_id)
		else:
			raise HTTPException(status_code=400, detail=f"Cannot decrement {prevUpdootState} below 0")

	if req.updootState != UpdootEnum.NONE:
		db.update(increment(req.updootState.value + "doots"), where("id") == word_id)

	return db.get(where("id") == word_id)

@app.get("/api/get_all_words", response_model=list[Record])
async def get_all_words(
	sortby: SortByEnum = SortByEnum.TOTALDOOTS, orderby: DirEnum = DirEnum.DESC
):
	IS_REVERSED = orderby == DirEnum.DESC

	if sortby == SortByEnum.TOTALDOOTS:
		return sorted(db.all(), key=lambda x: x["updoots"] - x["downdoots"], reverse=IS_REVERSED)

	elif sortby == SortByEnum.ID:
		return sorted(db.all(), key=lambda x: x["id"], reverse=IS_REVERSED)

	elif sortby == SortByEnum.UPDOOTS:
		return sorted(db.all(), key=lambda x: x["updoots"], reverse=IS_REVERSED)

	elif sortby == SortByEnum.DOWNDOOTS:
		return sorted(db.all(), key=lambda x: x["downdoots"], reverse=IS_REVERSED)

	elif sortby == SortByEnum.CREATION_DATE:
		return sorted(db.all(), key=lambda x: x["creationDate"], reverse=IS_REVERSED)

	elif sortby == SortByEnum.ALPHABETICAL:
		return sorted(db.all(), key=lambda x: x["word"].lower(), reverse=IS_REVERSED)


@app.get("/api/get_word/{wordID}", response_model=Record)
async def get_word_by_ID(wordID: int):
	response = db.search(where("id") == wordID)
	
	if response:
		return response[0]
	
	else:
		raise HTTPException(status_code=404, detail="Item not found lol")


@app.get("/api/get_range_of_words", response_model=RangeOfWords)
async def get_range_of_words(offset: int = 0, size: int = 5):
	data = db.all()

	if size < 1:
		raise HTTPException(status_code=400, detail="Size cannot be less than 1")

	if offset < 0:
		raise HTTPException(status_code=400, detail="Offset cannot be less than 0")

	if offset > len(data):
		raise HTTPException(
			status_code=400, detail="Offset cannot be greater than the length the data"
		)

	return {"dictWords": data[offset : offset + size], "max": len(db)}


@app.get("/api/lookup_word/{word}", response_model=Record)
async def lookup_word_by_string(word: str):
	response = db.search(where("word") == word)

	if response:
		return response[0]
	
	raise HTTPException(status_code=404, detail="Word not found lol")


@app.get("/api/get_uploaders_posts/{uploader}", response_model=list[Record])
async def get_all_of_a_uploaders_posts(uploader):
	return db.search(where("uploader") == uploader.capitalize())


@app.get("/api/get_all_uploaders", response_model=list[str])
async def get_names_of_all_uploaders():
	return list(set([x["uploader"] for x in db.search(where("uploader").exists())]))


@app.get("/api/get_random_word", response_model=RandomWord)
async def get_a_random_word_and_one_from_the_english_dictionary():
	return {
		"word": choice(db.all()),
		"realRandomWord": RandomWords().get_random_word(),
	}

# -------------------------------------------
# Hosts the static frontend on the root path.
# This has to be after API routes, since otherwise they're all overwritten by this
app.mount("/", StaticFiles(directory="../static", html=True), name="static")