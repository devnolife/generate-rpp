"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function FloatingElements() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const elements = containerRef.current.querySelectorAll(".floating-element")
      const { clientX, clientY } = e
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const moveX = (clientX - centerX) / 50
      const moveY = (clientY - centerY) / 50

      elements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const depth = Number.parseFloat(htmlEl.getAttribute("data-depth") || "1")
        const offsetX = moveX * depth
        const offsetY = moveY * depth

        htmlEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      })
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Modern Gradient Blobs */}
      <motion.div
        className="floating-element absolute top-[5%] right-[10%] w-72 h-72 rounded-full bg-gradient-to-r from-indigo-200/20 to-indigo-400/10 blur-3xl"
        data-depth="1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.7,
          scale: 1,
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="floating-element absolute bottom-[15%] left-[5%] w-96 h-96 rounded-full bg-gradient-to-r from-fuchsia-100/20 to-indigo-200/10 blur-3xl"
        data-depth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.6,
          scale: 1,
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      />

      {/* Gen Z Decorative Elements */}
      <motion.div
        className="floating-element absolute top-[20%] left-[15%] w-16 h-16 rounded-full bg-white/30 backdrop-blur-md border border-indigo-100/50"
        data-depth="3"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.8,
          scale: [1, 1.2, 1],
          rotate: [0, 45, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="floating-element absolute bottom-[25%] right-[20%] w-20 h-20 rounded-lg bg-white/30 backdrop-blur-md border border-white/50 rotate-45"
        data-depth="2.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.8,
          scale: [1, 1.1, 1],
          rotate: [45, 90, 45],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 2,
        }}
      />

      {/* Gen Z Geometric Shapes */}
      <motion.div
        className="floating-element absolute top-[40%] right-[25%] w-12 h-12 bg-indigo-200/20 backdrop-blur-md rounded-full"
        data-depth="4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.8,
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* 3D-like elements */}
      <motion.div
        className="floating-element absolute top-[60%] left-[30%] w-16 h-16 bg-gradient-to-br from-white/80 to-white/20 backdrop-blur-md rounded-xl shadow-lg transform rotate-12"
        data-depth="3"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 0.9,
          y: [0, -15, 0],
          rotate: [12, 0, 12],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="floating-element absolute top-[30%] right-[40%] w-12 h-12 bg-gradient-to-br from-primary-lighter/40 to-primary-light/20 backdrop-blur-md rounded-full shadow-lg"
        data-depth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 0.8,
          scale: [1, 1.2, 1],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 0.5,
        }}
      />

      {/* Emoji-like elements */}
      <motion.div
        className="floating-element absolute bottom-[40%] left-[15%] w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md"
        data-depth="2.5"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 0.9,
          y: [0, -10, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <span className="text-lg">✨</span>
      </motion.div>

      <motion.div
        className="floating-element absolute top-[50%] right-[15%] w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full shadow-md"
        data-depth="3"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 0.9,
          y: [0, 10, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 4.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          delay: 1,
        }}
      >
        <span className="text-lg">🚀</span>
      </motion.div>

      {/* Modern Dots Pattern */}
      <div className="absolute top-0 right-0 w-full h-full">
        <div className="absolute top-[10%] right-[30%] w-2 h-2 rounded-full bg-indigo-400/30"></div>
        <div className="absolute top-[15%] right-[35%] w-1 h-1 rounded-full bg-indigo-400/20"></div>
        <div className="absolute top-[20%] right-[25%] w-1.5 h-1.5 rounded-full bg-indigo-400/25"></div>
        <div className="absolute top-[25%] right-[40%] w-1 h-1 rounded-full bg-indigo-400/20"></div>
        <div className="absolute top-[30%] right-[20%] w-2 h-2 rounded-full bg-indigo-400/30"></div>

        <div className="absolute bottom-[10%] left-[30%] w-2 h-2 rounded-full bg-fuchsia-300/30"></div>
        <div className="absolute bottom-[15%] left-[35%] w-1 h-1 rounded-full bg-fuchsia-300/20"></div>
        <div className="absolute bottom-[20%] left-[25%] w-1.5 h-1.5 rounded-full bg-fuchsia-300/25"></div>
        <div className="absolute bottom-[25%] left-[40%] w-1 h-1 rounded-full bg-fuchsia-300/20"></div>
        <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-fuchsia-300/30"></div>
      </div>
    </div>
  )
}

