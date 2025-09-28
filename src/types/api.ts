export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  'hydra:member': T[];
  'hydra:totalItems': number;
  'hydra:view'?: {
    '@id': string;
    '@type': string;
    'hydra:first'?: string;
    'hydra:last'?: string;
    'hydra:previous'?: string;
    'hydra:next'?: string;
  };
}

export interface ApiError {
  '@type': string;
  title: string;
  detail: string;
  violations?: Array<{
    propertyPath: string;
    message: string;
  }>;
}

export interface ApiFilters {
  page?: number;
  limit?: number;
  order?: Record<string, 'asc' | 'desc'>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}