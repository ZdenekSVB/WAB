import { User } from '../stores/authStore'; // Importujeme rozhraní User

export const getDisplayName = (user: User | null): string => {
    if (!user) return '';
    return user.nickname || user.email;
};