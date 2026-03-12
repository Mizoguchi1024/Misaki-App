import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { McpServerFrontResponse } from '@renderer/types/chat'

interface McpState {
  mcpEnabled: boolean
  servers: McpServerFrontResponse[] | null
  enabledServers: string[]

  setMcpEnabled: (mcpEnabled: boolean) => void
  setServers: (servers: McpServerFrontResponse[]) => void
  setEnabledServers: (enabledServers: string[]) => void
  reset: () => void
}

const initialState = {
  mcpEnabled: false,
  servers: null,
  enabledServers: []
}

export const useMcpStore = create<McpState>()(
  persist(
    (set) => ({
      ...initialState,

      setMcpEnabled: (mcpEnabled) => set({ mcpEnabled }),
      setServers: (servers) => set({ servers }),
      setEnabledServers: (enabledServers) => set({ enabledServers }),
      reset: () => set(initialState)
    }),
    {
      name: 'mcp-store'
    }
  )
)
