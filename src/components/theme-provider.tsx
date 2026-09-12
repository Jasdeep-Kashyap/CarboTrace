import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  resolvedTheme: "dark" | "light"
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem(storageKey) as Theme | null
    if (saved === "light" || saved === "dark") return saved
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "dark"
  })

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      const active: "dark" | "light" = theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : (theme as "dark" | "light")

      root.classList.remove("light", "dark")
      root.classList.add(active)
      setResolvedTheme(active)
    }

    updateTheme()

    if (theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)")
      const listener = () => updateTheme()
      media.addEventListener("change", listener)
      return () => media.removeEventListener("change", listener)
    }
  }, [theme])

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark"
    localStorage.setItem(storageKey, next)
    setTheme(next)
  }

  const value: ThemeProviderState = {
    theme,
    resolvedTheme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t)
      setTheme(t)
    },
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
