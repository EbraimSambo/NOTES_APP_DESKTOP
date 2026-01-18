import { useAtom } from 'jotai';
import { createModalOpenAtom, createLoadingAtom } from '@/store/atoms';
import { useCreateNote } from '@/hooks/notes/useCreateNote.Hook';

export function useCreateModal() {
  const [isModalOpen, setIsModalOpen] = useAtom(createModalOpenAtom);
  const [createLoading] = useAtom(createLoadingAtom);
  const { submitCreateNote } = useCreateNote();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return {
    isModalOpen,
    createLoading,
    submitCreateNote,
    openModal,
    closeModal
  };
}
