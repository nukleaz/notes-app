import { z } from 'zod';
import { validateResponse } from './validateResponse';

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	username: z.string().min(5),
});

type TUser = z.infer<typeof UserSchema>;

export function registerUser(data: {
	username: string;
	email: string;
	password: string;
}): Promise<void> {
	return fetch('/api/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then(() => undefined);
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
