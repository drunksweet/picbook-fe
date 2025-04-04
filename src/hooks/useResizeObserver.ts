"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export function useResizeObserver(ref: React.RefObject<HTMLElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const resizeObserver = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    if (ref.current) {
      // 初始化尺寸
      setDimensions({
        width: ref.current.clientWidth,
        height: ref.current.clientHeight,
      })

      // 创建ResizeObserver实例
      resizeObserver.current = new ResizeObserver((entries) => {
        if (entries[0]) {
          const { width, height } = entries[0].contentRect
          setDimensions({ width, height })
        }
      })

      // 开始观察元素
      resizeObserver.current.observe(ref.current)
    }

    // 清理函数
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    }
  }, [ref])

  return dimensions
}

