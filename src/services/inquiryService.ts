import { api } from "@/lib/axios";
import { ApiSuccess, Inquiry } from "@/types";

export interface CreateInquiryPayload {
  propertyId: string;
  message: string;
}

export const inquiryService = {
  async create(payload: CreateInquiryPayload): Promise<Inquiry> {
    const res = await api.post<ApiSuccess<Inquiry>>("/inquiries", payload);
    return res.data.data;
  },

  async getMine(): Promise<Inquiry[]> {
    const res = await api.get<ApiSuccess<Inquiry[]>>("/inquiries/my");
    return res.data.data;
  },
};
