import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, patch } from '../utils/apiClient';

const ASSETS_KEY = ['assets'];

const fetchAssets = ({ page, limit }) =>
  get(`/assets?page=${page ?? 1}&limit=${limit ?? 20}`);

const toggleFavoriteRequest = (id) => patch(`/assets/${id}/favorite`);

const useAssets = ({ page = 1, limit = 20 } = {}) => {
  const queryClient = useQueryClient();

  const assetsQuery = useQuery({
    queryKey: [...ASSETS_KEY, page, limit],
    queryFn: () => fetchAssets({ page, limit })
  });

  const toggleFavorite = useMutation({
    mutationFn: toggleFavoriteRequest,
    onSuccess: (updatedAsset) => {
      queryClient.setQueryData([...ASSETS_KEY, page, limit], (current) => {
        if (!current) {
          return current;
        }
        const items = current.items.map((item) =>
          item._id === updatedAsset._id ? updatedAsset : item
        );
        return { ...current, items };
      });
    }
  });

  return {
    assetsQuery,
    toggleFavorite
  };
};

export default useAssets;
