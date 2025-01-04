"use server";

import { auth } from "@clerk/nextjs/server";

import { getMonitors } from "@/lib/apiEndpoints";
import { axiosGet } from "@/lib/utils";

export const getMonitorsAction = async (req, res) => {
  try {
    const { getToken } = await auth();
    const token = await getToken();
    const res = axiosGet(getMonitors, token);
    return res;
  } catch (error) {
    console.error(error);
  }
};
