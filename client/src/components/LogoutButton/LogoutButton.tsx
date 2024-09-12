import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { Button } from '../Button';
import { logout } from '../api/User';
import './LogoutButton.css';

export const LogoutButton = () => {
	const queryClient = useQueryClient();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const logoutMutation = useMutation({
		mutationFn: logout,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
			window.location.href = '/login';
		},
		onError: (error: Response) => {
			const errorMessage = error.toString().slice(7);
			setErrorMessage(errorMessage);
		},
	});

	return (
		<div className='logout-button'>
			<Button
				type='button'
				kind='secondary'
				onClick={() => logoutMutation.mutate()}
				isLoading={logoutMutation.isLoading}
			>
				Выйти
			</Button>
			{errorMessage && <p className='error-message'>{errorMessage}</p>}
		</div>
	);
};
