import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { createNote } from '../api/Note';
import './NoteForm.css';

const NoteFormSchema = z.object({
	title: z.string().min(5, 'Введите не меньше 5 символом'),
	text: z
		.string()
		.min(10, 'Введите не меньше 10 символов')
		.max(300, 'Превышен лимит символов'),
});

type CreateNoteForm = z.infer<typeof NoteFormSchema>;

export const NoteForm = () => {
	const queryClient = useQueryClient();

	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateNoteForm>({ resolver: zodResolver(NoteFormSchema) });

	const createNoteMutation = useMutation({
		mutationFn: createNote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['notes'] });
			reset();
		},
		onError: (error: Response) => {
			const errorMessage = error.toString().slice(7);
			setServerError(errorMessage);
		},
	});
	return (
		<form
			className='note-form'
			onSubmit={handleSubmit(data => {
				createNoteMutation.mutate(data);
			})}
		>
			<FormField label='Заголовок' errorMessage={errors.title?.message}>
				<input type='text' {...register('title')} />
			</FormField>
			<FormField label='Текст' errorMessage={errors.text?.message}>
				<textarea {...register('text')} />
			</FormField>
			<Button isLoading={createNoteMutation.isLoading}>Сохранить</Button>
			{serverError && <p className='error-message'>{serverError}</p>}
		</form>
	);
};
