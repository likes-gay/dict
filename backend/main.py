from enum import Enum
import time

from fastapi import	FastAPI, HTTPException,	Query, Request
from fastapi.middleware.cors import	CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

from random_word import	RandomWords
from random	import choice

from tinydb	import TinyDB, Query
from tinydb.operations import increment

from os import getenv
from fastapi.staticfiles import StaticFiles

# -------------------------------------------

db = TinyDB("data/dict_db.json")
cookie_table = db.table('session_cookies')
app	= FastAPI(redirect_slashes=True)

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
#async def session_cookie(request: Request, call_next):
#	response = await call_next(request)
#
#	if "session" not in request.cookies:
#		response.set_cookie(key="session", value="cookie_value")
#		cookie_table.insert({
#			"cookie_value": {
#				"creation_date": 0,
#
#			}
#		})
#	
#	return response

@app.middleware("http")
async def remove_trailing_slash(request: Request, call_next):
    if request.url.path != "/" and request.url.path.endswith("/"):
        url = str(request.url)
        url = url.rstrip("/")
        return RedirectResponse(url, 301)
    return await call_next(request)

# -------------------------------------------

#@app.middleware("http")
#async def session_cookie(request: Request, call_next):
#	response = await call_next(request)
#
#	if "session" not in request.cookies:
#		response.set_cookie(key="session", value="cookie_value")
#		cookie_table.insert({
#			"cookie_value": {
#				"creation_date": 0,
#
#			}
#		})
#	
#	return response

# -------------------------------------------

@app.get("/api")
def check_if_api_is_working():
	return {"I'm a": "teapot"}

@app.get("/api/num_of_words")
async def count_of_words():
	return {"totalWords": len(db)}

@app.post("/api/upload_word", status_code=201)
async def upload_new_word(newWord: UploadWordFormat):
	#Check if word is empty
	if newWord.word	== "":
		raise HTTPException(status_code=400, detail="Word cannot be empty")

	#Check if word already exists
	if db.search(Query().word == newWord.word):
		raise HTTPException(status_code=400, detail="Word already exists")
	
	if newWord.description == "":
		raise HTTPException(status_code=400, detail="Description cannot	be empty")
	
	record = {
		"id": len(db),
		"word":	newWord.word,
		"description": newWord.description,
		"creationDate":	newWord.creationDate or int(time.time()),
		"uploader":	newWord.uploader.capitalize() or "Unknown",
		"updoots": 0
	}
	
	db.insert(record)

	return(record)

@app.delete("/api/delete_word")
async def delete(req: DeleteWord):
	if req.secretKey != getenv("SECRET_KEY"):
		raise HTTPException(status_code=403, detail="Unauthorised, invalid secret key")
	


@app.post("/api/update_updoot")
async def update_words_updoot_count(req: UpdateUpdoot):
	if req.isUpdooted == "":
		raise HTTPException(status_code=400, detail="isUpdooted	cannot be empty")

	if req.id == "":
		raise HTTPException(status_code=400, detail="id	cannot be empty")
	
	if req.isUpdooted == True:
		db.update(increment("updoots"),	Query().id == req.id)
	
	response = db.search(Query().id	== req.id)
	return(response[0])
		
@app.get("/api/get_word/{id}")
async def get_word_by_ID(id: int):
	response = db.search(Query().id	== id)
	
	if response:
		return response[0]
	else:
		raise HTTPException(status_code=404, detail="Item not found	lol")

@app.get("/api/get_all_words")
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


@app.get("/api/get_range_of_words")
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
		"max": len(db)
	}
	
@app.get("/api/lookup_id/{word}")
async def lookup_id_of_word(word: str):
	response = db.search(Query().word == word)
	if response:
		return {"id": response[0]["id"]}

	else:
		raise HTTPException(status_code=404, detail="Item not found	lol")


@app.get("/api/get_uploaders_posts/{uploader}")
async def get_all_of_a_uploaders_posts(uploader: str):
	response = db.search(Query().uploader == uploader.capitalize())

	return(response)


@app.get("/api/get_random_word")
async def get_a_random_word_and_one_from_the_english_dictionary():
	return {
		"word":	choice(db.all())["word"],
		"realRandomWord": RandomWords().get_random_word()
	}

# -------------------------------------------
#Hosts the static frontend on the root path.
#This has to be after API routes, since otherwise they're all overwritten by this
app.mount("/", StaticFiles(directory="../static", html=True), name="static")