"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Upload, DollarSign, Tag, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateProduct,
  useProductById,
  useUpdateProduct,
} from "@/services/product.service";
import { toastError, toastSuccess } from "@/utils/toast";
import Loader from "@/components/Loader";
import {
  ProductFormValues,
  productSchema,
} from "@/schemas/product/product.schema";
import { categories } from "@/common/constats.common";
import { useNavigate } from "@/hooks/useNavigate";
import { generateFilePath } from "@/services/url.service";

const AddProduct = ({ id }: { id?: string }) => {
  //IMPORTS
  const navigate = useNavigate();

  //STATES
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  //MUTATIONS
  const { mutateAsync: createProduct, isPending: isCreating } =
    useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } =
    useUpdateProduct();

  //DATA
  const { data: productData, isLoading: isLoadingProduct } = useProductById(
    id || "",
    !!id
  );

  //FORM
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    },
  });

  //EFFECT: Prefill form when editing
  useEffect(() => {
    if (productData) {
      reset({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        image: productData.image || "",
      });

      if (productData.image) {
        setImagePreview(generateFilePath(productData.image));
      }
    }
  }, [productData, reset]);

  //HANDLERS
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue("image", result); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      if (id) {
        // Update existing product
        const res = await updateProduct({ id, ...data });
        if (res?.data?.message) {
          toastSuccess(res.data.message);
          navigate("/products");
        }
      } else {
        // Create new product
        const res = await createProduct(data);
        if (res?.data?.message) {
          toastSuccess(res.data.message);
          navigate("/products");
        }
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="relative container mx-auto px-4 py-8">
        <Card className=" max-w-2xl mx-auto shadow-lg border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  Product Title *
                </Label>
                <Input
                  {...register("title")}
                  placeholder="Enter product title..."
                  className="h-12"
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  {...register("description")}
                  placeholder="Describe your product..."
                  className="min-h-[100px]"
                />
              </div>

              {/* Price and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    Price *
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="h-12"
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-purple-500" />
                    Category
                  </Label>
                  <Select
                    onValueChange={(value) => setValue("category", value)}
                    value={watch("category")}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 flex items-center">
                  <Image className="w-4 h-4 mr-2 text-indigo-500" />
                  Product Image
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover mx-auto rounded-lg shadow-md"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview(null);
                          setValue("image", "");
                        }}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <label htmlFor="image" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            or drag and drop
                          </span>
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="w-full h-12 bg-black cursor-pointer"
                >
                  {id ? "Update Product" : "Add Product"}
                  {(isCreating || isUpdating) && <Loader />}
                </Button>
              </div>
            </form>
          </CardContent>
          {(isUpdating || isCreating || isLoadingProduct) && (
            <div
              className="absolute left-0 top-0 flex h-full w-full items-center justify-center p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.85)" }}
            >
              <Loader />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;
