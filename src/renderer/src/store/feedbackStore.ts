import { FeedbackFrontResponse } from '@renderer/types/api/feedback'
import { Feedback } from '@renderer/types/entity/feedback'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FeedbackState {
  feedbacks: Feedback[] | null

  setFeedbacks: (feedbackFrontResponses: FeedbackFrontResponse[]) => void
  reset: () => void
}

const initialState = {
  feedbacks: null
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      ...initialState,

      setFeedbacks: (feedbackFrontResponses) => set({ feedbacks: feedbackFrontResponses }),
      reset: () => set(initialState)
    }),
    {
      name: 'feedback-store'
    }
  )
)
