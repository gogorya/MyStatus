"use server";

import { auth } from "@clerk/nextjs/server";

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
