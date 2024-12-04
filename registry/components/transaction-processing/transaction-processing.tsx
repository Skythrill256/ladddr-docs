
"use client"

import * as React from "react"
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion"
import { Check, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

type TransactionConfirmationProps = HTMLMotionProps<"div"> & {
  isOpen: boolean
  onClose: () => void
  transactionHash: string
  sourceConfirmed: boolean
  destinationConfirming: boolean
  sourceText?: string
  destinationText?: string
  primaryColor?: string
  secondaryColor?: string
  modalClassName?: string
}

const TransactionConfirmation = React.forwardRef<HTMLDivElement, TransactionConfirmationProps>(({
  className,
  isOpen,
  onClose,
  transactionHash,
  sourceConfirmed,
  destinationConfirming,
  sourceText = "Confirmed in source",
  destinationText = "Confirming for destination",
  primaryColor = "green",
  secondaryColor = "blue",
  modalClassName,
  ...props
}, ref) => {
  const [isClosing, setIsClosing] = React.useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      onClose()
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
          className
        )}
        {...props}
      >
        <TransactionConfirmationContent
          isClosing={isClosing}
          onClose={handleClose}
          transactionHash={transactionHash}
          sourceConfirmed={sourceConfirmed}
          destinationConfirming={destinationConfirming}
          sourceText={sourceText}
          destinationText={destinationText}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          modalClassName={modalClassName} // Pass through modal styles
        />
      </motion.div>
    </AnimatePresence>
  )
})
TransactionConfirmation.displayName = "TransactionConfirmation"

type TransactionConfirmationContentProps = HTMLMotionProps<"div"> & {
  isClosing: boolean
  onClose: () => void
  transactionHash: string
  sourceConfirmed: boolean
  destinationConfirming: boolean
  sourceText: string
  destinationText: string
  primaryColor: string
  secondaryColor: string
  modalClassName?: string
}

const TransactionConfirmationContent = React.forwardRef<HTMLDivElement, TransactionConfirmationContentProps>(({
  className,
  isClosing,
  onClose,
  transactionHash,
  sourceConfirmed,
  destinationConfirming,
  sourceText,
  destinationText,
  primaryColor,
  secondaryColor,
  modalClassName,
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: "spring", damping: 15, stiffness: 300 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md relative",
        isClosing && "pointer-events-none",
        modalClassName, // Allow modal class customization
        className
      )}
      {...props}
    >
      <CloseButton onClose={onClose} />
      <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Transaction Confirmation</h2>
      <TransactionStatus
        confirmed={sourceConfirmed}
        text={sourceText}
        color={primaryColor}
        icon={<Check className="h-5 w-5" />}
      />
      <TransactionStatus
        confirmed={!destinationConfirming}
        text={destinationText}
        color={secondaryColor}
        icon={<Loader2 className="h-5 w-5 animate-spin" />}
        animate={destinationConfirming}
      />
      <TransactionDetails transactionHash={transactionHash} />
    </motion.div>
  )
})
TransactionConfirmationContent.displayName = "TransactionConfirmationContent"

type CloseButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  onClose: () => void
}

const CloseButton = React.forwardRef<HTMLButtonElement, CloseButtonProps>(({ className, onClose, ...props }, ref) => (
  <button
    ref={ref}
    onClick={onClose}
    className={cn(
      "absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
      className
    )}
    {...props}
  >
    <X className="h-6 w-6" />
  </button>
))
CloseButton.displayName = "CloseButton"

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
  <div ref={ref} className={cn("flex items-center space-x-2 my-2", className)} {...props}>
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
  </div>
))
TransactionStatus.displayName = "TransactionStatus"

type TransactionDetailsProps = React.HTMLAttributes<HTMLDivElement> & {
  transactionHash: string
}

const TransactionDetails = React.forwardRef<HTMLDivElement, TransactionDetailsProps>(({
  className,
  transactionHash,
  ...props
}, ref) => (
  <div ref={ref} className={cn("mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg", className)} {...props}>
    <h3 className="text-lg font-semibold mb-2 dark:text-white">Transaction Details</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{transactionHash}</p>
  </div>
))
TransactionDetails.displayName = "TransactionDetails"

export { TransactionConfirmation }
