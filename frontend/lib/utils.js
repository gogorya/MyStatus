import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

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

export const axiosGet = async (url, token) => {
  try {
    const res = await axios.get(url, {
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
      url,
      { data },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw error;
    } else {
      console.error(error);
    }
  }
};
