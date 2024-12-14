import { getMessages } from "next-intl/server";

export const fetchMessages = async (locale: string) => {
  return await getMessages({ locale });
};
