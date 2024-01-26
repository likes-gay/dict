# Dict

Link to website: https://dict.likes.gay

## How to run

### Production

1. Run `npm run build` in [`frontend`](https://github.com/likes-gay/dict/tree/main/frontend)
2. Run `uvicorn main:app` in [`backend`](https://github.com/likes-gay/dict/tree/main/backend)

### Dev

1. Run `npm run build:dev` in [`frontend`](https://github.com/likes-gay/dict/tree/main/frontend)
2. Run `uvicorn main:app --reload` in [`backend`](https://github.com/likes-gay/dict/tree/main/backend)

## Site

The site is hosted by a Raspberry Pi. The backend reads static files from [`static`](https://github.com/likes-gay/dict/tree/deploy/static) in the [deploy branch](https://github.com/likes-gay/dict/tree/deploy).

Everytime there's a commit to main, then it a [GitHub Action](https://github.com/likes-gay/dict/blob/main/.github/workflows/compile.yml) should automatilly compile the files for static.

## Shell Scripts

### service_setup.sh

Use the `service_setup.sh` script to setup the service that will runs dict. This will create a service called 'dict' and start it. The service will be started on boot and will restart if it crashes.

### service_disable.sh

Use the `service_disable.sh` script to disable the service that runs dict. This will stop the service, disable it from starting on boot and delete the service.

## deploy.sh

To quickly update the service, run the `deploy.sh` script. This will pull the latest changes from the git repo and restart the service while also preserving the database.


## To Do

- [x] Add updoot button
- [x] Random word API endpoint
- [x] Migrate to a database rather than JSON file. Potentially [tiny db](https://tinydb.readthedocs.io/en/latest/)
- [ ] Impliment char limits for each JSON value
- [ ] Improve security, require API key?
- [ ] Add a way to delete entries
- [ ] Add a way to edit entries
- [ ] Add a way to search entries
- [x] Add a way to sort entries
- [ ] Add a way to export entries
- [ ] Add a way to import entries
- [ ] Add a way to view entries by date
- [ ] Filter by updoot count
- [ ] Add a way to filter entries
- [x] Order by updoot count
- [ ] Downdoot button?
- [ ] Usage counter
- [x] Add a way to view entries by user
- [ ] Add word catergories
- [ ] Add a way to view entries by word catergory
- [ ] Add validation on acepted query params more effeciently
- [ ] Improve frontend Tooltip