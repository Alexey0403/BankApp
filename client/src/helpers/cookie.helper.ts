const TOKEN_KEY = 'access_token';

export function setAccessToken(token: string) {
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=900`;
};

export function getAccessToken() {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(TOKEN_KEY + '='))
        ?.split('=')[1] ?? null;
};

export function clearAccessToken() {
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
};