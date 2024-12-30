import key from "@config/config.json";
import { cert, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
    credential: cert(key as ServiceAccount),
});

const db = getFirestore();
export default db;
