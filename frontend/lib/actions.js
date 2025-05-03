"use server";

import { auth } from "@clerk/nextjs/server";

const host = process.env.API_HOST || "http://localhost:8080";

export const fetchPublicAction = async (url, options) => {
  try {
    options.headers["x-api-key"] = process.env.API_KEY || null;
    const res = await fetch(host + url, options);

    if (!res.ok && res.status !== 404) {
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
    options.headers["x-api-key"] = process.env.API_KEY || null;
    const res = await fetch(host + url, options);

    if (!res.ok && res.status !== 409) {
      throw new Error(`Response status: ${res.status}`);
    }

    let data = null;
    if (res.status !== 204) data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
