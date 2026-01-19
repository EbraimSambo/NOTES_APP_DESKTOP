import React from "react";
import { Note } from '@/types/notes.core';
import { getNotes } from "@/actions/get-notes";
import { getDeletedNotes } from "@/actions/get-deleted-notes";
import { useAtom } from 'jotai';
import { notesAtom, notesLoadingAtom, notesErrorAtom, paginationAtom, loadingMoreAtom } from '@/store/atoms';

interface GetNotesParams {
    page?: number;
    limit?: number;
    reset?: boolean;
    isPinned?: boolean;
    isDeleted?: boolean;
}

export function useGetNotes({ page = 1, limit = 10, reset = false, isPinned, isDeleted }: GetNotesParams = {}) {
    const [notes, setNotes] = useAtom(notesAtom);
    const [loading, setLoading] = useAtom(notesLoadingAtom);
    const [error, setError] = useAtom(notesErrorAtom);
    const [pagination, setPagination] = useAtom(paginationAtom);
    const [loadingMore, setLoadingMore] = useAtom(loadingMoreAtom);

    const fetchNotes = React.useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
        try {
            if (isLoadMore) {
                setLoadingMore(true);
            } else {
                setLoading(true);
                setError(null);
            }
            
            const notesServer = isDeleted 
                ? await getDeletedNotes({ page: pageNum, limit })
                : await getNotes({ page: pageNum, limit, isPinned, isDeleted });
            
            if (reset || pageNum === 1) {
                setNotes(notesServer.notes as unknown as Note[]);
                setPagination({
                    page: 1,
                    limit,
                    hasMore: notesServer.total >= limit,
                    totalCount: notesServer.total
                });
            } else {
                setNotes(prevNotes => [...prevNotes, ...(notesServer.notes as unknown as Note[])]);
                setPagination(prev => ({
                    ...prev,
                    page: pageNum,
                    hasMore: notesServer.total >= limit,
                    totalCount: prev.totalCount + notesServer.total
                }));
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unknown error');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [limit, reset, setNotes, setLoading, setError, setPagination, setLoadingMore]);

    const loadMore = React.useCallback(() => {
        if (!pagination.hasMore || loadingMore || loading) return;
        const nextPage = pagination.page + 1;
        fetchNotes(nextPage, true);
    }, [pagination.hasMore, pagination.page, loadingMore, loading, fetchNotes]);

    const resetNotes = React.useCallback(() => {
        fetchNotes(1, false);
    }, [fetchNotes]);

    React.useEffect(() => {
        fetchNotes(page, false);
    }, [fetchNotes, page]);

    const reorderNotes = (activeId: string, overId: string) => {
        setNotes(prevNotes => {
            const oldIndex = prevNotes.findIndex(note => note.orderId === parseInt(activeId));
            const newIndex = prevNotes.findIndex(note => note.orderId === parseInt(overId));
            
            if (oldIndex === -1 || newIndex === -1) return prevNotes;
            
            const newNotes = [...prevNotes];
            const [movedNote] = newNotes.splice(oldIndex, 1);
            newNotes.splice(newIndex, 0, movedNote);
            
            // Update orderId for all notes
            return newNotes.map((note, index) => ({
                ...note,
                orderId: index
            }));
        });
    };
    
    return {
        notes,
        loading,
        loadingMore,
        error,
        hasMore: pagination.hasMore,
        setNotes,
        reorderNotes,
        loadMore,
        resetNotes
    };
}