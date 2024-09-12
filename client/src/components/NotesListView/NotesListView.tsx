import { FC } from 'react';
import { NoteView } from '../NoteView';
import { NoteList } from '../api/Note';
import './NotesListView.css';

interface NotesListViewProps {
	notesList: NoteList;
}

export const NotesListView: FC<NotesListViewProps> = ({ notesList }) => {
	return (
		<ul className='note-list'>
			{notesList.map(note => (
				<li className='note-list__item' key={note.id}>
					<NoteView note={note} />
				</li>
			))}
		</ul>
	);
};
