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
    'xml': '/images/fileIcons/xml.png',
  }[format]
  if (icon) {
    return icon
  }
  return '/images/fileIcons/undefined.png'
}

export const formatDatePeriod = (from:string,to:string)=>{
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const dayFrom = fromDate.getDate();
  const dayTo = toDate.getDate();
  const month = months[fromDate.getMonth()];
  const year = fromDate.getFullYear();

  return `${dayFrom} - ${dayTo} ${month} ${year}`;
}