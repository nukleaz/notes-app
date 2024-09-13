import { useQuery } from 'react-query';
import { AuthForm } from '../AuthForm';
import { Loader } from '../Loader';
import { LogoutButton } from '../LogoutButton';
import { NoteForm } from '../NoteForm';
import { FetchNotesListView } from '../NotesListView/FetchNotesListView';
import { UserView } from '../UserView';
import { fetchMe } from '../api/User';

export const Account = () => {
	const meQuery = useQuery({
		queryKey: ['users', 'me'],
		queryFn: fetchMe,
		refetchOnWindowFocus: false,
	});

	switch (meQuery.status) {
		case 'loading':
			return <Loader />;

		case 'error':
			return <AuthForm />;

		case 'success':
			return (
				<>
					<UserView user={meQuery.data} />
					<div className='notes-wrapper'>
						<NoteForm />
						<FetchNotesListView userId={meQuery.data.id} />
					</div>
					<LogoutButton />
				</>
			);
	}
};
