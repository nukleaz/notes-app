import { z } from 'zod';
import { validateResponse } from './validateResponse';

const NoteSchema = z.object({
	id: z.string(),
	title: z.string(),
	text: z.string(),
	userId: z.string(),
	createdAt: z.number(),
});
export type Note = z.infer<typeof NoteSchema>;

const NoteList = z.array(NoteSchema);
export type NoteList = z.infer<typeof NoteList>;

const FetchNotesListSchema = z.object({
	list: NoteList,
	pageCount: z.number(),
});

type FetchNotesListResponse = z.infer<typeof FetchNotesListSchema>;

export function fetchNotesList(): Promise<FetchNotesListResponse> {
	return fetch('/api/notes')
		.then(validateResponse)
		.then(response => response.json())
		.then(data => FetchNotesListSchema.parse(data));
}

export function createNote(text: string): Promise<void> {
	return fetch('/api/notes', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
	})
		.then(validateResponse)
		.then(() => undefined);
}
