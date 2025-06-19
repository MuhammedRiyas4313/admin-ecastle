import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosAuth from "./axios.service";
import { API_ENDPOINT, GeneralApiResponse, GeneralApiResponsePagination } from "./url.service";

export interface ICategory {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const END_POINT: string = API_ENDPOINT("/categories");

/**
 * MUTATIONS
 */

//CREATE CATEGORY
const createCategory = (obj: Partial<ICategory>) => {
  return axiosAuth.post(END_POINT, obj);
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });
};

//UPDATE CATEGORY
const udpateCategory = ({ id, ...obj }: any) => {
  return axiosAuth.put(`${END_POINT}/${id}`, obj);
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: udpateCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category_by_id"] });
    },
  });
};

//DELETE CATEGORY
const deleteCategory = (id: string) => {
  return axiosAuth.delete(`${END_POINT}/${id}`);
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["category_by_id"] });
    },
  });
};

//================================================================================//

/**
 * QUERIES
 */

type QueryObj = {
  pageIndex: string;
  pageSize: string;
  search: string;
}

//GET ALL CATEGORIES
const getCategories = (queryObj: QueryObj | {}) => {
  const query = new URLSearchParams(queryObj as Record<string, string>).toString();
  return axiosAuth.get<GeneralApiResponsePagination<ICategory>>(
    `${END_POINT}?${query}`
  );
};

export const useCategories = (
  queryObj: QueryObj | {} = {},
  enabled = true
) => {
  return useQuery({
    queryKey: ["category", queryObj],
    queryFn: () => getCategories(queryObj).then((res) => res.data),
    enabled: enabled,
  });
};

//GET CATEGORY BY ID
const getCategoryById = (id: string) => {
  return axiosAuth.get<GeneralApiResponse<ICategory>>(`${END_POINT}/${id}`);
};

export const useCategoryById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["category_by_id", id],
    queryFn: () => getCategoryById(id).then((res) => res.data?.data),
    enabled: enabled,
  });
};
