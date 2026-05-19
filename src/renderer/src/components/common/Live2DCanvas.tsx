import React, { useEffect, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'untitled-pixi-live2d-engine/cubism'

const MODEL_HEIGHT_RATIO = 0.85
const MODEL_BOTTOM_RATIO = 0.95

type Live2DCanvasProps = {
  modelUrl?: string
  onLoadingChange?: (loading: boolean) => void
}

const Live2DCanvas = ({ modelUrl, onLoadingChange }: Live2DCanvasProps): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const appRef = useRef<PIXI.Application | null>(null) // 存储 app 实例以便销毁

  useEffect(() => {
    let isMounted = true

    if (!modelUrl) {
      onLoadingChange?.(false)
      return
    }

    onLoadingChange?.(true)

    const initPixi = async (): Promise<void> => {
      // 1. 初始化 PixiJS v8 Application
      const app = new PIXI.Application()
      try {
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
        const model = await Live2DModel.from(modelUrl)

        // 只有在组件还没被销毁时才添加
        if (isMounted) {
          const fitModel = (): void => {
            const bounds = model.getLocalBounds()

            if (bounds.width <= 0 || bounds.height <= 0) {
              return
            }

            const targetHeight = app.screen.height * MODEL_HEIGHT_RATIO
            const scale = targetHeight / bounds.height

            model.scale.set(scale)
            model.pivot.set(bounds.x + bounds.width / 2, bounds.y + bounds.height)
            model.position.set(app.screen.width / 2, app.screen.height * MODEL_BOTTOM_RATIO)
          }

          app.stage.addChild(model)
          fitModel()

          // 响应窗口缩放
          app.renderer.on('resize', fitModel)
        }
      } catch (error) {
        console.error('Live2D 模型加载失败:', error)
      } finally {
        if (isMounted) {
          onLoadingChange?.(false)
        }
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
  }, [modelUrl, onLoadingChange])

  return <div ref={containerRef} className="w-full h-full" />
}

export default Live2DCanvas
