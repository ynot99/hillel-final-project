interface PaginationResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<T>;
}
