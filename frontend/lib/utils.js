import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { fetchPublicAction, fetchApiAction } from "./actions";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const checkLink = (link) => {
  const urlPattern = new RegExp(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,}(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    "i"
  );
  return !!urlPattern.test(link);
};

export const formatDate = (utcDate) => {
  const dateString = new Date(utcDate.toString()).toLocaleString();
  const [date, time, mi] = dateString.split(" ");
  const [hour, minute] = time.split(":");
  return `${date} ${hour}:${minute} ${mi === undefined ? "" : mi}`;
};

export const fetchPublic = {
  get: async (url) => {
    const res = await fetchPublicAction(url, { method: "GET", headers: {} });
    return res;
  },
};

export const fetchApi = {
  get: async (url) => {
    const res = await fetchApiAction(url, { method: "GET", headers: {} });
    return res;
  },
  post: async (url, data) => {
    const res = await fetchApiAction(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    return res;
  },
  patch: async (url, data) => {
    const res = await fetchApiAction(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });
    return res;
  },
  delete: async (url) => {
    const res = await fetchApiAction(url, { method: "DELETE", headers: {} });
    return res;
  },
};
