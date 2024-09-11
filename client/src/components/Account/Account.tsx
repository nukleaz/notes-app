import { useQuery } from 'react-query';
import { AuthForm } from '../AuthForm';
import { Loader } from '../Loader';
import { LogoutButton } from '../LogoutButton';
import { NoteForm } from '../NoteForm';
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
					<NoteForm />
					<LogoutButton />
				</>
			);
	}
};
