import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Tool } from '@modelcontextprotocol/sdk/types.js'

export default class MCPClient {
  mcp: Client
  transport: StdioClientTransport | null = null
  tools: Tool[] = []

  constructor() {
    this.mcp = new Client({ name: 'mcp-client', version: '1.0.0' })
  }

  async connectToServer(serverScriptPath: string) {
    try {
      const isJs = serverScriptPath.endsWith('.js')
      const isTs = serverScriptPath.endsWith('.ts')
      const isPy = serverScriptPath.endsWith('.py')
      if (!isJs && !isTs && !isPy) {
        throw new Error('Server script must be a .js or .ts or .py file')
      }

      let command: string
      let args: string[] = []

      if (isPy) {
        command = process.platform === 'win32' ? 'python' : 'python3'
        args = [serverScriptPath]
      } else if (isTs) {
        command = 'npx'
        args = ['tsx', serverScriptPath]
      } else {
        command = process.execPath
        args = [serverScriptPath]
      }

      this.transport = new StdioClientTransport({
        command,
        args
      })
      await this.mcp.connect(this.transport)

      const toolsResult = await this.mcp.listTools()
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema
        }
      })
      console.log(
        'Connected to server with tools:',
        this.tools.map(({ name }) => name)
      )
    } catch (e) {
      console.log('Failed to connect to MCP server: ', e)
      throw e
    }
  }

  async cleanup() {
    await this.mcp.close()
  }
}
