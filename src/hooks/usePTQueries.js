import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { searchPTs } from '~/services/searchService';
import { getPTDetailPublic, getAllPTProfilesPublic } from '~/services/ptProfileService';
import { getPackagesByPTPublic } from '~/services/packageService';

export const PT_SEARCH_QUERY_KEY = (params) => ['pts', 'search', params];
export const PT_DETAIL_QUERY_KEY = (idOrSlug) => ['pts', 'detail', idOrSlug];
export const PT_PACKAGES_QUERY_KEY = (ptUserId) => ['pts', ptUserId, 'packages'];
export const PT_PUBLIC_LIST_QUERY_KEY = (params) => ['pts', 'public-list', params];

/**
 * Hook tìm kiếm HLV theo bộ lọc và phân trang
 * - Cache kết quả 5 phút theo từng bộ lọc
 * - Sử dụng placeholderData: keepPreviousData để chuyển trang & filter mượt mà không nhấp nháy
 */
export function useSearchPTsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: PT_SEARCH_QUERY_KEY(params),
    queryFn: async () => {
      const res = await searchPTs(params);
      return res || { items: [], total: 0 };
    },
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook lấy chi tiết HLV theo id hoặc slug
 * - Cache 5 phút, truy cập lại tải ngay trong 0ms
 */
export function usePTDetailQuery(idOrSlug, options = {}) {
  return useQuery({
    queryKey: PT_DETAIL_QUERY_KEY(idOrSlug),
    queryFn: async () => {
      if (!idOrSlug) return null;
      const res = await getPTDetailPublic(idOrSlug);
      return res?.data || res || null;
    },
    enabled: Boolean(idOrSlug),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook lấy danh sách gói tập công khai của HLV
 * - Tự động liên kết với HLV qua ptUserId
 * - Cache 5 phút
 */
export function usePTPackagesQuery(ptUserId, options = {}) {
  return useQuery({
    queryKey: PT_PACKAGES_QUERY_KEY(ptUserId),
    queryFn: async () => {
      if (!ptUserId) return [];
      const res = await getPackagesByPTPublic(ptUserId);
      const data = res?.data || res || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: Boolean(ptUserId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook lấy toàn bộ danh sách HLV công khai (cho trang PTList)
 */
export function usePublicPTListQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: PT_PUBLIC_LIST_QUERY_KEY(params),
    queryFn: async () => {
      const res = await getAllPTProfilesPublic(params);
      const data = res?.data || [];
      return Array.isArray(data) ? data : [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    ...options,
  });
}
