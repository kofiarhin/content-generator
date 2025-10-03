import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, post } from '../utils/apiClient';

const PROFILE_KEY = ['profile'];

const fetchProfile = () => get('/profile');
const saveProfileRequest = (payload) => post('/profile', payload);

const useProfile = () => {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: fetchProfile,
    retry: 0
  });

  const saveProfile = useMutation({
    mutationFn: saveProfileRequest,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data);
    }
  });

  return {
    profileQuery,
    saveProfile
  };
};

export default useProfile;
