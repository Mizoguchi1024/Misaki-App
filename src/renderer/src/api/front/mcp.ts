import { McpServerFrontResponse } from '@renderer/types/chat'
import { Result } from '@renderer/types/result'
import api from '../index'

export const listMcpServers = (): Promise<Result<McpServerFrontResponse[]>> =>
  api.get<Result<McpServerFrontResponse[]>>('/front/mcp').then((res) => res.data)
