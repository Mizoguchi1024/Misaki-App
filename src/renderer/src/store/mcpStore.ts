import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface McpState {
  mcpEnabled: boolean
  enabledServers: string[]

  setMcpEnabled: (mcpEnabled: boolean) => void
  setEnabledServers: (enabledServers: string[]) => void
  reset: () => void
}

const initialState = {
  mcpEnabled: false,
  enabledServers: []
}

export const useMcpStore = create<McpState>()(
  persist(
    (set) => ({
      ...initialState,

      setMcpEnabled: (mcpEnabled) => set({ mcpEnabled }),
      setEnabledServers: (enabledServers) => set({ enabledServers }),
      reset: () => set(initialState)
    }),
    {
      name: 'mcp-store'
    }
  )
)
