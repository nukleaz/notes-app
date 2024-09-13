import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { loginUser } from '../api/User';
import './LoginForm.css';

const CreateLoginSchema = z.object({
	email: z.string().email('Неккоректный формат email'),
	password: z.string().min(8, 'Минимум 8 символом'),
});

type CreateLoginForm = z.infer<typeof CreateLoginSchema>;

export const LoginForm = () => {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm<CreateLoginForm>({ resolver: zodResolver(CreateLoginSchema) });

	const [serverError, setServerError] = useState<string | null>(null);

	const createLoginMutation = useMutation({
		mutationFn: loginUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
		},
		onError: (error: Response) => {
			reset();
			setServerError(error.toString().slice(7));
		},
	});

	const emailValue = watch('email');
	const passwordValue = watch('password');

	useEffect(() => {
		if (emailValue || passwordValue) setServerError(null);
	}, [emailValue, passwordValue]);

	return (
		<form
			className='login-form'
			onSubmit={handleSubmit(data => {
				createLoginMutation.mutate(data);
			})}
		>
			{serverError && <p className='error-message'>{serverError}</p>}
			<FormField label='Email' errorMessage={errors.email?.message}>
				<input type='text' {...register('email')} />
			</FormField>
			<FormField label='Пароль' errorMessage={errors.password?.message}>
				<input type='password' {...register('password')} />
			</FormField>
			<Button type='submit' isLoading={createLoginMutation.isLoading}>
				Войти
			</Button>
		</form>
	);
};
