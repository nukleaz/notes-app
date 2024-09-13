import { FC } from 'react';
import { User } from '../api/User';
import './UserView.css';

interface UserViewProps {
	user: User;
}

export const UserView: FC<UserViewProps> = ({ user }) => {
	return (
		<div className='user-view'>
			<div className='user-view__logo'>
				{user.username.slice(0, 1).toUpperCase()}
			</div>
			<span className='user-view__name'>{user.username}</span>
		</div>
	);
};
