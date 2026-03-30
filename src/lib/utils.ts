import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const LOGO_URL = "https://storage.googleapis.com/dala-prod-public-storage/attachments/c872830e-838d-4094-a23d-d674329790e4/1774853988710_image.jpg.jpeg";