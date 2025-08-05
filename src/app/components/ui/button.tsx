import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline"
  size?: "sm" | "default" | "lg"
  children: React.ReactNode
}

export function Button({ className = "", variant = "default", size = "default", children, ...props }: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500",
  }

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
  }

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
