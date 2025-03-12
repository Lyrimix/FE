import { create } from "zustand";

export const useLoadingStore = create((set) => ({
  isLoading : false,
  setIsLoading : (loading) => set({isLoading:loading})
}))
