import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  getVersions: () => ipcRenderer.invoke('get-versions'),
  listMcpServers: () => ipcRenderer.invoke('mcp-server-version'),
  listMcpTools: () => ipcRenderer.invoke('mcp-list-tools'),
  getSystemTheme: () => ipcRenderer.sendSync('system-theme'),
  onSystemThemeChange: (callback) =>
    ipcRenderer.on('system-theme-change', (_, dark) => callback(dark))
}
export type API = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
