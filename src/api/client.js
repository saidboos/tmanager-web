import axios from "axios";
import { CREDENTIALS_KEY, INIT_KEY } from "../auth/AuthContext";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Helper to read saved creds
export function getDevCreds() {
  // you saved them earlier at login: { email, password } OR { username, password }
  return JSON.parse(localStorage.getItem(CREDENTIALS_KEY));
}

export const callInitAPI = async () => {
  const creds = getDevCreds();

  console.log("callInitAPI", creds);

  // This is an init api call to load all needed data at once
  const initResponse = await api.post("/api/user/all", {
    username: creds.username,
    password: creds.password,
  });

  const initData = initResponse.data;
  if (initData.success) {
    const mData = initData.data;
    localStorage.setItem(
      INIT_KEY,
      JSON.stringify({ mData, savedAt: Date.now() })
    );
  } else console.log("Init API call failed");
};

export const updateUserAPI = async (data) => {
  const creds = getDevCreds();
  const payload = {
    id: data.id,
    adminUsername: creds.username,
    adminPassword: creds.password,
    roleId: Number(data.roleId),
    titleId: Number(data.titleId),
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    username: data.username,
    phoneNumber: data.phoneNumber,
  };

  const response = await api.post("/api/user/update-user", payload);
  return response.data;
};
