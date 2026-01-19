import { useAtom } from 'jotai';
import { createModalOpenAtom, createLoadingAtom } from '@/store/atoms';
import { useCreateNote } from '@/hooks/notes/useCreateNote.Hook';
import { useCallback } from 'react';

export function useCreateModal() {
  const [isModalOpen, setIsModalOpen] = useAtom(createModalOpenAtom);
  const [createLoading] = useAtom(createLoadingAtom);
  const { submitCreateNote } = useCreateNote();

  const openModal = useCallback(() => setIsModalOpen(true), [setIsModalOpen]);
  const closeModal = useCallback(() => setIsModalOpen(false), [setIsModalOpen]);

  return {
    isModalOpen,
    createLoading,
    submitCreateNote,
    openModal,
    closeModal
  };
}