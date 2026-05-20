import apiClient from "@/lib/api-client";
import { TAX_PTKP_ENDPOINTS } from "../endpoints";
import { TaxPtkpSetting } from "../types";
import { ApiResponse } from "@/types";

export const taxPtkpSettingService = {
  getList: async () => {
    const response = await apiClient.get<ApiResponse<TaxPtkpSetting[]>>(
      TAX_PTKP_ENDPOINTS.LIST
    );
    return response.data;
  },
};
