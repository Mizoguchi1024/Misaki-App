import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { McpServerFrontResponse } from '@renderer/types/chat'

interface McpState {
  servers: McpServerFrontResponse[] | null
  enabledServers: string[]

  setServers: (servers: McpServerFrontResponse[]) => void
  setEnabledServers: (enabledServers: string[]) => void
  reset: () => void
}

const initialState = {
  servers: null,
  enabledServers: []
}

export const useMcpStore = create<McpState>()(
  persist(
    (set) => ({
      ...initialState,

      setServers: (servers) => set({ servers }),
      setEnabledServers: (enabledServers) => set({ enabledServers }),
      reset: () => set(initialState)
    }),
    {
      name: 'mcp-store'
    }
  )
)
