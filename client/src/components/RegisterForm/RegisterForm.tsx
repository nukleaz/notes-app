import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { registerUser } from '../api/User';
import './RegisterForm.css';

const CreateRegisterSchema = z.object({
	username: z.string().min(5),
	email: z.string().email(),
	password: z.string().min(8),
});

type CreateRegisterForm = z.infer<typeof CreateRegisterSchema>;

export const RegisterForm = () => {
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		reset,
	} = useForm<CreateRegisterForm>({
		resolver: zodResolver(CreateRegisterSchema),
	});

	const createRegisterMutation = useMutation({
		mutationFn: registerUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Response) => {
			setError('root', { message: error.toString().slice(7) });

			reset({ username: '', email: '', password: '' }, { keepErrors: true });
		},
	});

	return (
		<form
			className='register-form'
			onSubmit={handleSubmit(data => {
				createRegisterMutation.mutate(data);
			})}
		>
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
