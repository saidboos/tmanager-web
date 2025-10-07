import { api, getDevCreds } from "./client";


export async function fetchUsers() {

    const creds = getDevCreds();

    if(!creds) throw new Error("No saved credentials");

    const loginReq = {
        username: creds.username,
        password: creds.password
    }

    console.log("loginReq", loginReq);

    const data = await api.post("/api/users/all", loginReq);

    const payload = data?.data?.data ?? data;

    return payload;
}