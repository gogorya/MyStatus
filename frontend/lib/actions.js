"use server";

import { auth } from "@clerk/nextjs/server";

const host = process.env.API_HOST || "http://localhost:8080";

export const fetchPublicAction = async (url, options) => {
  try {
    const res = await fetch(host + url, options);

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

export const fetchApiAction = async (url, options) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();

    options.headers.Authorization = `Bearer ${token}`;
    const res = await fetch(host + url, options);

    if (!res.ok) {
      throw new Error(`Response status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};
