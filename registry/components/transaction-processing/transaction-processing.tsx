"use client"
import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

type TransactionStatusProps = HTMLMotionProps<"div"> & {
  confirmed: boolean
  text: string
  color: string
  icon: React.ReactNode
  animate?: boolean
}

const TransactionStatus = React.forwardRef<HTMLDivElement, TransactionStatusProps>(({
  className,
  confirmed,
  text,
  color,
  icon,
  animate,
  ...props
}, ref) => (
  <motion.div ref={ref} className={cn("flex items-center space-x-2 my-2", className)} {...props}>
    <motion.div
      animate={animate ? { rotate: 360 } : confirmed ? { scale: [1, 1.2, 1] } : {}}
      transition={animate ? { repeat: Infinity, duration: 1, ease: "linear" } : { duration: 0.5 }}
      className={cn(
        "rounded-full p-1",
        confirmed ? `bg-${color}-100 text-${color}-600` : "bg-gray-100 text-gray-400"
      )}
    >
      {icon}
    </motion.div>
    <span className={cn("font-medium", confirmed ? `text-${color}-600` : "text-gray-500")}>
      {text}
    </span>
  </motion.div>
))
TransactionStatus.displayName = "TransactionStatus"

export { TransactionStatus }
