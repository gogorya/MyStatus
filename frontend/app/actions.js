"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

const host = process.env.API_HOST || "http://localhost:8080";

export const getDataAction = async (url) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const res = axiosGet(url, token);
    return res;
  } catch (error) {
    console.error(error);
  }
};

export const getDataPublicAction = async (url, slug) => {
  try {
    const data = { slug };
    const res = await axios.post(host + url, { data });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const axiosGet = async (url, token) => {
  try {
    const res = await axios.get(host + url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const axiosPost = async (url, token, data) => {
  try {
    const res = await axios.post(
      host + url,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
