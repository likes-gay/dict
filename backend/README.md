# Endpoints

## GET
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