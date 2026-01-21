import { clearAccessToken, setAccessToken } from '@/helpers/cookie.helper';
import { apiFetch } from '@/lib/api';
import { IUser } from '@/types/user';

export async function login(login: string, password: string) {
    const res = await apiFetch('/Auth/login', {
        method: 'POST',
        body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
        throw new Error('Login failed');
    }

    const data = await res.json();

    setAccessToken(data.token);

    return data;
}

export async function register(data: {
  name: string;
  surname: string;
  birthday: string;
  phone_number: string;
  gmail: string;
  password: string;
}) {
    const res = await apiFetch('/Auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Register failed');
    };

    await login(data.gmail, data.password);
};

export async function logout() {
    clearAccessToken();
    window.location.reload();
};

export async function getMe(): Promise<IUser> {
    const res = await apiFetch('/User/myprofile');

    if (res.status === 401) {
        throw new Error('Unauthorized');
    };

    if (!res.ok) {
        throw new Error('Failed');
    };

    return res.json();
};