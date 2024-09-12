import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { Button } from '../Button';
import { FormField } from '../FormField';
import {
	emailTemplate,
	passwordTemplate,
	registerUser,
	usernameTemplate,
} from '../api/User';
import './RegisterForm.css';

const CreateRegisterSchema = z.object({
	username: usernameTemplate,
	email: emailTemplate,
	password: passwordTemplate,
});

type CreateRegisterForm = z.infer<typeof CreateRegisterSchema>;

export const RegisterForm = () => {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		reset,
	} = useForm<CreateRegisterForm>({
		resolver: zodResolver(CreateRegisterSchema),
	});

	const [serverError, setServerError] = useState<string | null>(null);

	const createRegisterMutation = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Response) => {
			reset();
			setServerError(error.toString().slice(7));
		},
	});

	const usernameValue = watch('username');
	const emailValue = watch('email');
	const passwordValue = watch('password');

	useEffect(() => {
		if (usernameValue || emailValue || passwordValue) setServerError(null);
	}, [usernameValue, emailValue, passwordValue]);

	return (
		<form
			className='register-form'
			onSubmit={handleSubmit(data => {
				createRegisterMutation.mutate(data);
			})}
		>
			{serverError && <p className='error-message'>{serverError}</p>}
			<FormField label='Имя' errorMessage={errors.username?.message}>
				<input type='text' {...register('username')} />
			</FormField>
			<FormField label='Email' errorMessage={errors.email?.message}>
				<input type='text' {...register('email')} />
			</FormField>
			<FormField label='Пароль' errorMessage={errors.password?.message}>
				<input type='password' {...register('password')} />
			</FormField>
			<Button type='submit' isLoading={createRegisterMutation.isLoading}>
				Зарегистрироваться
			</Button>
		</form>
	);
};
