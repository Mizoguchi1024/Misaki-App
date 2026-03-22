import React, { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'untitled-pixi-live2d-engine/cubism'

const Live2DCanvas = ({ modelUrl }): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<PIXI.Application | null>(null) // 存储 app 实例以便销毁

  useEffect(() => {
    let isMounted = true

    const initPixi = async (): Promise<void> => {
      // 1. 初始化 PixiJS v8 Application
      const app = new PIXI.Application()
      await app.init({
        resizeTo: window,
        backgroundAlpha: 0,
        preference: 'webgl',
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      })

      if (!isMounted) {
        app.destroy(true, true)
        return
      }

      appRef.current = app
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas)
      }

      // 2. 加载模型
      try {
        const model = await Live2DModel.from(modelUrl)

        // 只有在组件还没被销毁时才添加
        if (isMounted) {
          model.anchor.set(0.7, 0.5)
          model.x = app.screen.width / 2
          model.y = app.screen.height / 2

          model.scale.set(0.2)

          app.stage.addChild(model)

          // 响应窗口缩放
          app.renderer.on('resize', () => {
            model.x = app.screen.width / 2
            model.y = app.screen.height / 2
          })
        }
      } catch (error) {
        console.error('Live2D 模型加载失败:', error)
      }
    }

    initPixi()

    // 3. 卸载时的清理逻辑（非常重要！）
    return () => {
      isMounted = false
      if (appRef.current) {
        appRef.current.destroy(true)
        appRef.current = null
      }
    }
  }, [modelUrl])

  return <div ref={containerRef} className="w-full h-full" />
}

export default Live2DCanvas
