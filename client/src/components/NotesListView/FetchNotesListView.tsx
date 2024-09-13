import { FC, useState } from 'react';
import { useQuery } from 'react-query';
import { NotesListView } from '.';
import { Loader } from '../Loader';
import { fetchNotesList } from '../api/Note';

interface FetchNotesListViewProps {
	userId: string;
}

export const FetchNotesListView: FC<FetchNotesListViewProps> = ({ userId }) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const notesListQuery = useQuery({
		queryKey: ['notes', userId],
		queryFn: fetchNotesList,
		onError: (error: Response) => {
			const errorMessage = error.toString().slice(7);
			setErrorMessage(errorMessage);
		},
	});

	console.log(notesListQuery.data?.list);

	switch (notesListQuery.status) {
		case 'loading':
			return <Loader />;

		case 'success':
			return <NotesListView notesList={notesListQuery.data.list} />;

		case 'error':
			return (
				<div>
					<span className='error-message'>{errorMessage}</span>
					<button
						onClick={() => {
							setErrorMessage(null);
							notesListQuery.refetch();
						}}
					>
						Повторить запрос
					</button>
				</div>
			);
	}
};
