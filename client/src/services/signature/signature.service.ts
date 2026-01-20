import { apiFetch } from "@/lib/api";
import { toast } from "../toasts/toast";
import { IUser } from "@/types/user";

export async function generateKeyPair() {
    return await window.crypto.subtle.generateKey(
        {
            name: "RSA-PSS",
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        },
        true,
        ["sign", "verify"],
    );
};

export async function exportPrivateKey(privateKey: CryptoKey): Promise<string> {
    const buffer = await crypto.subtle.exportKey("pkcs8", privateKey);
    return bufferToPem(buffer, "PRIVATE KEY");
};

export async function exportPublicKey(publicKey: CryptoKey): Promise<string> {
    const buffer = await crypto.subtle.exportKey("spki", publicKey);
    return bufferToPem(buffer, "PUBLIC KEY");
};

function bufferToPem(buffer: ArrayBuffer, label: string): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach(b => (binary += String.fromCharCode(b)));

    const base64 = window.btoa(binary);
    const lines = base64.match(/.{1,64}/g)?.join("\n");

    return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
};

function pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
        .replace(/-----BEGIN [\s\S]+?-----/, "")
        .replace(/-----END [\s\S]+?-----/, "")
        .replace(/\s/g, "");

    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
};

export async function importPrivateKeyFromPem(pem: string): Promise<CryptoKey> {
    const buffer = pemToArrayBuffer(pem);

    return await crypto.subtle.importKey(
        "pkcs8",
        buffer,
        {
            name: "RSA-PSS",
            hash: "SHA-256",
        },
        false,
        ["sign"]
    );
};

export function downloadPrivateKey(pem: string) {
    const blob = new Blob([pem], { type: "application/x-pem-file" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "private_key.pem";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export async function sendPublicKeyToBackend(publicKeyPem: string, user: IUser | null) {
    try {
        const res = await apiFetch("/User/myprofile/update", {
            method: "PUT",
            body: JSON.stringify({
                ...user,
                publickey: publicKeyPem,
            }),
        });

        if (!res.ok) {
            throw new Error(res.statusText);
        };

        const data = await res.json();

        return data;
    } catch (err) {
        if (err instanceof Error) {
            toast.error(err.message);
        };
    };
};

export async function signTransaction(privateKey: CryptoKey, payload: string): Promise<string> {
    const signature = await crypto.subtle.sign(
        {
            name: "RSA-PSS",
            saltLength: 32,
        },
        privateKey,
        new TextEncoder().encode(payload)
    );

    return window.btoa(
        String.fromCharCode(...new Uint8Array(signature))
    );
};

export async function importPublicKeyFromPem(pem: string): Promise<CryptoKey> {
    const buffer = pemToArrayBuffer(pem);

    return await crypto.subtle.importKey(
        "spki",
        buffer,
        {
            name: "RSA-PSS",
            hash: "SHA-256",
        },
        false,
        ["verify"]
    );
};

export async function verifyTransactionSignature(
    publicKey: CryptoKey,
    payload: string,
    signatureBase64: string
): Promise<boolean> {

    const signature = Uint8Array.from(
        atob(signatureBase64),
        c => c.charCodeAt(0)
    );

    return await crypto.subtle.verify(
        {
            name: "RSA-PSS",
            saltLength: 32,
        },
        publicKey,
        signature,
        new TextEncoder().encode(payload)
    );
};

export function pemToBase64(pem: string): string {
    return pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "")
    .trim();
};