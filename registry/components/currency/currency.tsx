"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as LabelPrimitive from "@radix-ui/react-label"

const ethereumBalanceSchema = z.object({
  eth: z.string().regex(/^\d*\.?\d*$/, "Invalid Ethereum balance"),
  gwei: z.string().regex(/^\d*\.?\d*$/, "Invalid Gwei balance"),
  wei: z.string().regex(/^\d*$/, "Invalid Wei balance"),
})

type ConversionUnit = "ETH" | "Gwei" | "Wei"

export interface EthereumBalanceInputProps extends React.ComponentPropsWithoutRef<typeof Card> {
  onBalanceChange?: (conversions: Record<ConversionUnit, string>) => void
}

// Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// Label component
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// Card components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const EthereumBalanceInput = React.forwardRef<HTMLDivElement, EthereumBalanceInputProps>(
  ({ className, onBalanceChange, ...props }, ref) => {
    const { register, setValue, watch, formState: { errors } } = useForm({
      resolver: zodResolver(ethereumBalanceSchema),
      defaultValues: {
        eth: "",
        gwei: "",
        wei: "",
      },
    })

    const eth = watch("eth")
    const gwei = watch("gwei")
    const wei = watch("wei")

    const convertBalance = (value: string, from: ConversionUnit): Record<ConversionUnit, string> => {
      if (!value || isNaN(Number(value))) return { ETH: "", Gwei: "", Wei: "" }

      let weiValue: bigint
      try {
        switch (from) {
          case "ETH":
            weiValue = BigInt(Math.floor(parseFloat(value) * 1e18))
            break
          case "Gwei":
            weiValue = BigInt(Math.floor(parseFloat(value) * 1e9))
            break
          case "Wei":
            weiValue = BigInt(value)
            break
        }
      } catch (error) {
        console.error("Conversion error:", error)
        return { ETH: "", Gwei: "", Wei: "" }
      }

      return {
        ETH: (Number(weiValue) / 1e18).toFixed(18),
        Gwei: (Number(weiValue) / 1e9).toFixed(9),
        Wei: weiValue.toString(),
      }
    }

    const updateValues = (value: string, from: ConversionUnit) => {
      const conversions = convertBalance(value, from)
      if (from !== "ETH") setValue("eth", conversions.ETH)
      if (from !== "Gwei") setValue("gwei", conversions.Gwei)
      if (from !== "Wei") setValue("wei", conversions.Wei)
      onBalanceChange?.(conversions)
    }

    React.useEffect(() => {
      updateValues(eth, "ETH")
    }, [eth])

    React.useEffect(() => {
      updateValues(gwei, "Gwei")
    }, [gwei])

    React.useEffect(() => {
      updateValues(wei, "Wei")
    }, [wei])

    return (
      <Card ref={ref} className={cn("w-full max-w-md mx-auto", className)} {...props}>
        <CardHeader>
          <CardTitle>Ethereum Balance Converter</CardTitle>
          <CardDescription>Enter a value in any unit to see conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eth">ETH</Label>
              <Input
                id="eth"
                placeholder="Enter amount in ETH"
                {...register("eth")}
                className={cn(errors.eth && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.eth && (
                <p className="text-red-500 text-sm">{errors.eth.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gwei">Gwei</Label>
              <Input
                id="gwei"
                placeholder="Enter amount in Gwei"
                {...register("gwei")}
                className={cn(errors.gwei && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.gwei && (
                <p className="text-red-500 text-sm">{errors.gwei.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="wei">Wei</Label>
              <Input
                id="wei"
                placeholder="Enter amount in Wei"
                {...register("wei")}
                className={cn(errors.wei && "border-red-500 focus-visible:ring-red-500")}
              />
              {errors.wei && (
                <p className="text-red-500 text-sm">{errors.wei.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)

EthereumBalanceInput.displayName = "EthereumBalanceInput"

export { EthereumBalanceInput }

