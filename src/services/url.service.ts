export const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const API_FULL_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/api`;

export const API_ENDPOINT = (path: string) => 
  `${API_FULL_BASE_URL}${path && path.startsWith('/') ? path : `/${path}`}`;


export const generateFilePath = (fileName: any) => {
  if (typeof fileName == "undefined" || fileName == null) {
    // return logo
  }

  if (typeof fileName != "string") {
    return fileName;
  }

  if (fileName.startsWith("http")) {
    return fileName;
  }

  return `${baseUrl}/uploads/${fileName}`;
};

export type GeneralApiResponse<T = unknown> = {
  message: string;
  data: T;
};

export type GeneralApiResponsePagination<T = unknown> = {
  message: string;
  data: T[];
  total: number;
};
