import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun } from "lucide-react"

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
]

export default function Navbar() {
  const { i18n } = useTranslation()

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          Bondity
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="rounded border px-2 py-1 text-sm bg-background text-foreground"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>

          <Button variant="ghost" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
