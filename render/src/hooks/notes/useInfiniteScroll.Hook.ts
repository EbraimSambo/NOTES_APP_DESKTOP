import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps {
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export function useInfiniteScroll({ 
  hasMore, 
  loadingMore, 
  onLoadMore, 
  threshold = 0.1 
}: UseInfiniteScrollProps) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false,
    rootMargin: '100px'
  });

  // Usar ref para onLoadMore para evitar dependências no useEffect
  const onLoadMoreRef = useRef(onLoadMore);
  
  // Atualizar a ref quando onLoadMore mudar
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  // Ref para prevenir múltiplas chamadas simultâneas
  const isLoadingRef = useRef(false);

  useEffect(() => {
    // Condições para carregar mais
    if (!inView || !hasMore || loadingMore || isLoadingRef.current) {
      return;
    }

    // Marcar como carregando
    isLoadingRef.current = true;

    // Chamar a função de load
    onLoadMoreRef.current();

    // Aguardar um curto período antes de permitir nova chamada
    const timeoutId = setTimeout(() => {
      isLoadingRef.current = false;
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inView, hasMore, loadingMore]);

  return { ref };
}