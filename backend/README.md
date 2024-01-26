# Endpoints

## `.env`

For the `/api/delete_word` endpoint.

```env
SECRECT_KEY= #Here
```

## GET

> [!WARNING]  
> These are probaly outdated, check [the API docs](https://likes.gay/docs) or [`main.py`](https://github.com/likes-gay/dict/blob/main/backend/main.py) for the updated ones.

`/num_of_words`
```typescript
{
	totalWords: number;
}
```

`/get_word?size=20&offset20&sort=updoots`
```typescript
{
    id: number;
    word: string;
    description: string;
    creationDate: number; //Unix timestamp
    updoots: number;
    uploader: string;
}
```

`/get_random_word`
```typescript
{
	word: {
		id: number;
		word: string;
		description: string;
		creationDate: number; //Unix timestamp
		updoots: number;
		uploader: string;
	},
	realRandomWord: string;
}
```

## POST
`/upload_word`
```typescript
{
	word: string;
	description: string;
	creationDate: number;
	uploader: string;
}
```

`/update_updoot/[word ID]`
```typescript
{
	id: number;
	isUpdooted: boolean;
}
```