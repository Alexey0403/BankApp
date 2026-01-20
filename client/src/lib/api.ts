import { clearAccessToken, getAccessToken } from "@/helpers/cookie.helper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  input: RequestInfo,
  init: RequestInit = {}
) {
    const token = getAccessToken();

    const res = await fetch(`${API_URL}${input}`, {
        ...init,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), 
            ...(init.headers || {}),
        },
    });

    if (res.status === 401) {
        clearAccessToken();
    };

    return res;
};