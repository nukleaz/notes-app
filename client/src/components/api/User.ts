import { z } from 'zod';
import { validateResponse } from './validateResponse';

export const emailTemplate = z.string().email('Неккоректный формат email');
export const usernameTemplate = z.string().min(5, 'Минимум 5 символом');
export const passwordTemplate = z.string().min(8, 'Минимум 8 символов');

const UserSchema = z.object({
	id: z.string(),
	email: emailTemplate,
	username: usernameTemplate,
});

type TUser = z.infer<typeof UserSchema>;

export function registerUser(data: {
	username: string;
	email: string;
	password: string;
}): Promise<void> {
	const formattedData = {
		...data,
		email: data.email.toLowerCase(),
	};
	return fetch('/api/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formattedData),
	})
		.then(validateResponse)
		.then(() => undefined);
}

export function loginUser(data: {
	email: string;
	password: string;
}): Promise<void> {
	const formattedData = {
		...data,
		email: data.email.toLowerCase(),
	};
	return fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(formattedData),
	})
		.then(validateResponse)
		.then(() => undefined);
}

export function fetchMe(): Promise<TUser> {
	return fetch('/api/users/me')
		.then(validateResponse)
		.then(response => response.json())
		.then(data => UserSchema.parse(data));
}

export function logout(): Promise<void> {
	return fetch('/api/logout', {
		method: 'POST',
	})
		.then(validateResponse)
		.then(() => undefined);
}
