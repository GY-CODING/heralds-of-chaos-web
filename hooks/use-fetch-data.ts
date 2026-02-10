"use client";

import { useState, useEffect, useCallback } from "react";
import { LoadingState } from "@/types/common.types";

/**
 * Opciones de configuración para el hook
 */
interface UseFetchDataOptions<T> {
  initialData?: T;
  autoFetch?: boolean;
}

/**
 * Estado retornado por el hook
 */
interface UseFetchDataReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  loadingState: LoadingState;
  refetch: () => Promise<void>;
}

/**
 * Hook personalizado para fetch de datos con manejo de estados
 * Encapsula la lógica común de carga, error y datos
 */
export function useFetchData<T>(
  fetchFn: () => Promise<T>,
  options: UseFetchDataOptions<T> = {},
): UseFetchDataReturn<T> {
  const { initialData = null, autoFetch = true } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.IDLE,
  );
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoadingState(LoadingState.LOADING);
      setError(null);

      const result = await fetchFn();

      setData(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setLoadingState(LoadingState.ERROR);
      console.error("[useFetchData] Error:", err);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (autoFetch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading: loadingState === LoadingState.LOADING,
    error,
    loadingState,
    refetch: fetchData,
  };
}
