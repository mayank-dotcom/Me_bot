import type React from "react"

interface BadgeProps {
  variant?: "default" | "secondary" | "outline"
  className?: string
  children: React.ReactNode
}

export function Badge({ variant = "default", className = "", children }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors"

  const variants = {
    default: "bg-blue-600 text-white",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-700",
  }

  const classes = `${baseStyles} ${variants[variant]} ${className}`

  return <span className={classes}>{children}</span>
}
