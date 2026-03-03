import { FeedbackFrontResponse } from '@renderer/types/feedback'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FeedbackState {
  feedbacks: FeedbackFrontResponse[] | null

  setFeedbacks: (feedbacks: FeedbackFrontResponse[]) => void
  reset: () => void
}

const initialState = {
  feedbacks: null
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      ...initialState,

      setFeedbacks: (feedbacks) => set({ feedbacks }),
      reset: () => set(initialState)
    }),
    {
      name: 'feedback-store'
    }
  )
)
