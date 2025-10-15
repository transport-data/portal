import { env } from "@env.mjs";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chunkArray = (arr: Array<any>, size: number) => {
  return arr.reduce((chunks, item, i) => {
    if (i % size === 0) {
      chunks.push([item]);
    } else {
      chunks[chunks.length - 1].push(item);
    }
    return chunks;
  }, []);
}

export const formatIcon = (format: string) => {
  const icon = {
    'csv': '/images/fileIcons/csv.png',
    'json': '/images/fileIcons/json.png',
    'pdf': '/images/fileIcons/pdf.png',
    'xls': '/images/fileIcons/xls.png',
    'xlsx': '/images/fileIcons/xls.png',
    'xml': '/images/fileIcons/xml.png',
    'mp4': '/images/fileIcons/mp4.png',
    'avi': '/images/fileIcons/mp4.png',
    'flv': '/images/fileIcons/mp4.png',
    'mov': '/images/fileIcons/mp4.png',
    'mpg': '/images/fileIcons/mp4.png',
    'mpeg': '/images/fileIcons/mp4.png',
    'wmv': '/images/fileIcons/mp4.png',
    'png': '/images/fileIcons/image.png',
    'bmp': '/images/fileIcons/image.png',
    'gif': '/images/fileIcons/image.png',
    'jpeg': '/images/fileIcons/image.png',
    'jpg': '/images/fileIcons/image.png',
    'tiff': '/images/fileIcons/image.png',
    'svg': '/images/fileIcons/svg.png'
  }[format]
  if (icon) {
    return icon
  }
  return '/images/fileIcons/undefined.png'
}

export const formatDate = (dateString:string)=>{
  return new Date(dateString).toLocaleDateString('en-GB');
}

export const formatDatePeriod = (from:string,to:string)=>{
  const fromDate = new Date(from);
  const toDate = new Date(to);

  // Formatter for day and month
  const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

  // Formatter for full date (with year)
  const fullDateFormatter = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  // Check if the from and to dates are in the same month and year
  const sameMonthYear = fromDate.getMonth() === toDate.getMonth() && fromDate.getFullYear() === toDate.getFullYear();

  if (sameMonthYear) {
    // 12 - 16 May 2023
    return `${fromDate.getDate()} - ${dayMonthFormatter.format(toDate)} ${toDate.getFullYear()}`;
  } else {
    // 12 Mar 2023 - 16 Apr 2023
    return `${fullDateFormatter.format(fromDate)} - ${fullDateFormatter.format(toDate)}`;
  }
}

export function getFileName(url: string) {
  return url.split("/").pop();
}

//convert bytes to human readable format
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function slugify(str: string) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

export function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
};


function capitalize(text:string) {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


export async function revalidatePath(path: string) {
  await fetch(`${process.env.NEXTAUTH_URL}/api/revalidate?path=${path}`, {
    headers: { Authorization: env.SYS_ADMIN_API_KEY },
  });
}
