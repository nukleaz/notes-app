import { useState } from 'react';
import { useQuery } from 'react-query';
import { NotesListView } from '.';
import { Loader } from '../Loader';
import { fetchNotesList } from '../api/Note';

export const FetchNotesListView = () => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const notesListQuery = useQuery({
		queryFn: () => fetchNotesList(),
		queryKey: ['notes'],
		onError: (error: Response) => {
			const errorMessage = error.toString().slice(7);
			setErrorMessage(errorMessage);
		},
	});

	switch (notesListQuery.status) {
		case 'loading':
			return <Loader />;

		case 'success':
			return <NotesListView notesList={notesListQuery.data.list} />;

		case 'error':
			return (
				<div>
					<span className='error-message'>{errorMessage}</span>
				</div>
			);
	}
};
