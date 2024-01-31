# Dict

## Site

See it live: https://dict.likes.gay

This site is hosted in a [Docker container](https://hub.docker.com/r/likesgay/dict) on a [Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/).

## About

### Frontend

* Writtern in typescript 
* Compiled using the first job in the [GitHub Action](https://github.com/likes-gay/dict/blob/main/.github/workflows/compile.yml)

### Backend

* Writtern in Python
* [FastAPI](https://fastapi.tiangolo.com/) used to run API and serve static files
* [TinyDB](https://tinydb.readthedocs.io/en/latest/) used to store words

### GitHub Actions

* Compiles the TypeScript
* Compiles Docker Image
* Pushes to [Docker Hub](https://hub.docker.com/r/likesgay/dict)

## How to run

### Production

The easiest and most secure way to run this is using our [offcial Docker image](https://hub.docker.com/r/likesgay/dict).

* **Make sure to replace the SECRET_KEY in the command**
* The default port it runs on is 8000. Change the first port to change the host port.
* The volume sets where the database file should be stored, so it persits. This defaults to the directory the command is run in.
* The detach argument runs the container in the background.
* The name argument sets the name

```shell
docker run -e SECRET_KEY="SET_SECRET_KEY_HERE" --publish 8000:8000 --volume $(pwd)/dict-data:/backend/dict-data --detach --restart always --name Dict likesgay/dict
```
The Docker container can automatically be updated to the latest image using [Watchtower](https://containrrr.dev/watchtower/).

### Dev

1. Run `npm run build:dev` in [`frontend`](https://github.com/likes-gay/dict/tree/main/frontend)
2. Run `uvicorn main:app --reload` in [`backend`](https://github.com/likes-gay/dict/tree/main/backend)

## To Do

- [x] Add updoot button
- [x] Random word API endpoint
- [x] Migrate to a database rather than JSON file. Potentially [TinyDB](https://tinydb.readthedocs.io/en/latest/)
- [ ] Impliment char limits for each JSON value
- [ ] Improve security, require API key?
- [x] Add a way to delete entries
- [ ] Add a way to edit entries
- [ ] Add a way to search entries
- [x] Add a way to sort entries
- [ ] Add a way to export entries
- [ ] Add a way to import entries
- [x] Add a way to view entries by date
- [x] Filter by updoot count
- [x] Add a way to filter entries
- [x] Order by updoot count
- [x] Downdoot button?
- [ ] Usage counter
- [ ] Add a way to view entries by user
- [ ] Add word catergories
- [ ] Add a way to view entries by word catergory
- [ ] Add validation on acepted query params more effeciently
- [ ] Improve frontend tooltip
