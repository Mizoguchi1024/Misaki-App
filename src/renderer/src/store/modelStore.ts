import { ModelFrontResponse } from '@renderer/types/model'
import { create } from 'zustand'

interface ModelState {
  models: ModelFrontResponse[] | null

  setModels: (models: ModelFrontResponse[]) => void
  reset: () => void
}

const initialState = { models: null }

export const useModelStore = create<ModelState>((set) => ({
  ...initialState,

  setModels: (models) => set({ models }),
  reset: () => set(initialState)
}))
