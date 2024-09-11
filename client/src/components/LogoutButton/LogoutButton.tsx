import { useMutation, useQueryClient } from 'react-query';
import { Button } from '../Button';
import { logout } from '../api/User';
import './LogoutButton.css';

export const LogoutButton = () => {
	const queryClient = useQueryClient();

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
			window.location.href = '/login';
		},
	});

	return (
		<>
			<div className='logout-button'>
				<Button
					type='button'
					kind='secondary'
					onClick={() => logoutMutation.mutate()}
					isLoading={logoutMutation.isLoading}
				>
					Выйти
				</Button>
			</div>
		</>
	);
};
