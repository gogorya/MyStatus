import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
  return `${date} ${mi == "pm" ? parseInt(hour) + 12 : hour}:${minute}`;
};
