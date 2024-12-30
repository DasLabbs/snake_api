import CryptoJS from "crypto-js";

const decrypt = <T>(encryptedData: string, key: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
};

export const decryptFinishPayload = (
    userId: string,
    gamePlayId: string,
    encryptedPayload: string,
) => {
    try {
        const payload = decrypt<{
            gamePlayId: string;
            userId: string;
            point: number;
            deadline: number;
        }>(encryptedPayload, `${userId}:${gamePlayId}`);
        return payload;
    } catch {
        return null;
    }
};

export const decryptAddLifePointPayload = (
    userId: string,
    encryptedPayload: string,
) => {
    try {
        const payload = decrypt<{
            userId: string;
            deadline: number;
            currentLifePoint: number;
        }>(encryptedPayload, userId);
        return payload;
    } catch {
        return null;
    }
};
