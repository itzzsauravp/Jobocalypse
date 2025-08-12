export interface PaginatedData<T> {
  data: T;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}
