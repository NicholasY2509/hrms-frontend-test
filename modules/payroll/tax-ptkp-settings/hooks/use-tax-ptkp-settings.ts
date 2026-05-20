import { useQuery } from '@tanstack/react-query';
import { taxPtkpSettingService } from '../services';
import { TAX_PTKP_ENDPOINTS } from '../endpoints';

export function useTaxPtkpSettings() {
  const { data, isLoading, error } = useQuery({
    queryKey: [TAX_PTKP_ENDPOINTS.LIST],
    queryFn: () => taxPtkpSettingService.getList(),
  });

  return {
    items: data?.data || [],
    isLoading,
    isError: error,
  };
}
