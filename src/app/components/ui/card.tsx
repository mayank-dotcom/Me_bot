import type React from "react"

interface CardProps {
  className?: string
  children: React.ReactNode
}

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

interface CardFooterProps {
  className?: string
  children: React.ReactNode
}

interface CardTitleProps {
  className?: string
  children: React.ReactNode
}

interface CardDescriptionProps {
  className?: string
  children: React.ReactNode
}

interface CardActionProps {
  className?: string
  children: React.ReactNode
}

interface CardContentProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
}

export function CardHeader({ className = "", children }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={`@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 ${className}`}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className = "", children }: CardFooterProps) {
  return (
    <div data-slot="card-footer" className={`flex items-center px-6 [.border-t]:pt-6 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ className = "", children }: CardTitleProps) {
  return (
    <div data-slot="card-title" className={`leading-none font-semibold ${className}`}>
      {children}
    </div>
  )
}

export function CardDescription({ className = "", children }: CardDescriptionProps) {
  return (
    <div data-slot="card-description" className={`text-muted-foreground text-sm ${className}`}>
      {children}
    </div>
  )
}

export function CardAction({ className = "", children }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
    >
      {children}
    </div>
  )
}

export function CardContent({ className = "", children }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>
}
