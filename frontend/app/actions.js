"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { axiosGet } from "@/lib/utils";

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
    console.log("url", url, data);
    const res = await axios.post(url, { data });
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
