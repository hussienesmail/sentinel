import type { PaginationData } from "./pagination";

export type ApiResponse<T> = {
  data: T;
  pagination?: PaginationData;
};
