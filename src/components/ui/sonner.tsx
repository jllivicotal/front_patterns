"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"
import type { ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      duration={4000}
      visibleToasts={5}
      richColors
      expand={true}
      gap={12}
      closeButton={true}
      style={
        {
          "--normal-bg": "hsl(var(--background))",
          "--normal-text": "hsl(var(--foreground))",
          "--normal-border": "hsl(var(--border))",
          "--success-bg": "hsl(var(--success-background, 142 76% 36%))",
          "--success-text": "hsl(var(--success-foreground, 355 7% 97%))",
          "--success-border": "hsl(var(--success-border, 142 76% 36%))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--error-border": "hsl(var(--destructive))",
          "--warning-bg": "hsl(var(--warning-background, 48 96% 53%))",
          "--warning-text": "hsl(var(--warning-foreground, 20 14% 4%))",
          "--warning-border": "hsl(var(--warning-border, 48 96% 53%))",
          "--info-bg": "hsl(var(--info-background, 221 83% 53%))",
          "--info-text": "hsl(var(--info-foreground, 210 40% 98%))",
          "--info-border": "hsl(var(--info-border, 221 83% 53%))",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          border: "2px solid hsl(var(--border))",
          borderRadius: "12px",
          backdropFilter: "blur(16px)",
          backgroundColor: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          padding: "20px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          minHeight: "70px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          minWidth: "400px",
        },
        className: "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl",
      }}
      {...props}
    />
  )
}

export { Toaster }
