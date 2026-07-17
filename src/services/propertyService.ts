import { api } from "@/lib/axios";
import { ApiSuccess, Pagination, Property, SearchParams } from "@/types";
import { CreatePropertyInput } from "@/features/properties/schemas";

interface PropertyListResult {
  properties: Property[];
  pagination: Pagination;
}

export const propertyService = {
  async search(params: SearchParams): Promise<PropertyListResult> {
    const res = await api.get<ApiSuccess<Property[]>>("/properties/search", { params });
    return {
      properties: res.data.data,
      pagination: res.data.meta!.pagination as Pagination,
    };
  },

  async getById(id: string): Promise<Property> {
    const res = await api.get<ApiSuccess<Property>>(`/properties/${id}`);
    return res.data.data;
  },

  async getSimilar(id: string): Promise<Property[]> {
    const res = await api.get<ApiSuccess<Property[]>>(`/properties/${id}/similar`);
    return res.data.data;
  },

  async getMine(): Promise<Property[]> {
    const res = await api.get<ApiSuccess<Property[]>>("/properties/my");
    return res.data.data;
  },

  async create(payload: CreatePropertyInput): Promise<Property> {
    const res = await api.post<ApiSuccess<Property>>("/properties", payload);
    return res.data.data;
  },

  async update(id: string, payload: Partial<CreatePropertyInput>): Promise<Property> {
    const res = await api.put<ApiSuccess<Property>>(`/properties/${id}`, payload);
    return res.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/properties/${id}`);
  },
};
