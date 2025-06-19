import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosAuth from "./axios.service";
import {
  API_ENDPOINT,
  GeneralApiResponse,
  GeneralApiResponsePagination,
} from "./url.service";

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const END_POINT: string = API_ENDPOINT("/products");

/**
 * MUTATIONS
 */

//CREATE PRODUCT
const createProduct = (obj: Partial<IProduct>) => {
  return axiosAuth.post(END_POINT, obj);
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
  });
};

//UPDATE PRODUCT
const udpateProduct = ({ id, ...obj }: any) => {
  return axiosAuth.put(`${END_POINT}/${id}`, obj);
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: udpateProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product_by_id"] });
    },
  });
};

//DELETE PRODUCT
const deleteProduct = (id: string) => {
  return axiosAuth.delete(`${END_POINT}/${id}`);
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["product_by_id"] });
    },
  });
};

//================================================================================//

/**
 * QUERIES
 */

type QueryObj = {
  pageIndex: any;
  pageSize: any;
  search: string;
};

//GET ALL PRODUCTS
const getProducts = (queryObj: QueryObj | {}) => {
  const query = new URLSearchParams(
    queryObj as Record<string, any>
  ).toString();
  return axiosAuth.get<GeneralApiResponsePagination<IProduct>>(
    `${END_POINT}?${query}`
  );
};

export const useProducts = (queryObj: QueryObj | {} = {}, enabled = true) => {
  return useQuery({
    queryKey: ["product", queryObj],
    queryFn: () => getProducts(queryObj).then((res) => res.data),
    enabled: enabled,
  });
};

//GET PRODUCT BY ID
const getProductById = (id: string) => {
  return axiosAuth.get<GeneralApiResponse<IProduct>>(`${END_POINT}/${id}`);
};

export const useProductById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["product_by_id", id],
    queryFn: () => getProductById(id).then((res) => res.data?.data),
    enabled: enabled,
  });
};
