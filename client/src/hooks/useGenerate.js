import { useMutation } from '@tanstack/react-query';
import { post } from '../utils/apiClient';

const useGenerate = () => {
  const generate = useMutation({
    mutationFn: (payload) => post('/generate', payload)
  });

  const batchGenerate = useMutation({
    mutationFn: (payload) => post('/generate/batch', payload)
  });

  const refine = useMutation({
    mutationFn: ({ id, operation }) => post(`/refine/${id}`, { operation })
  });

  return {
    generate,
    batchGenerate,
    refine
  };
};

export default useGenerate;
