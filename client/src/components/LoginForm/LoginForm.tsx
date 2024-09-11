import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { loginUser } from '../api/User';
import './LoginForm.css';

const CreateLoginSchema = z.object({
	email: z.string().email('Неккоректный формат email'),
	password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
});

type CreateLoginForm = z.infer<typeof CreateLoginSchema>;

export const LoginForm = () => {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		reset,
	} = useForm<CreateLoginForm>({ resolver: zodResolver(CreateLoginSchema) });
	const createLoginMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
		},
		onError: (error: Response) => {
			setError('email', {
				message: error.toString().slice(7),
			});
			setError('password', {
				message: error.toString().slice(7),
			});
			reset({ email: '', password: '' }, { keepErrors: true });
		},
	});

	return (
		<form
			className='login-form'
			onSubmit={handleSubmit(data => {
				createLoginMutation.mutate(data);
			})}
		>
			<FormField label='Email' errorMessage={errors.email?.message}>
				<input type='text' {...register('email')} />
			</FormField>
			<FormField label='Пароль' errorMessage={errors.root?.message}>
				<input type='password' {...register('password')} />
			</FormField>
			<Button type='submit' isLoading={createLoginMutation.isLoading}>
				Войти
			</Button>
		</form>
	);
};
