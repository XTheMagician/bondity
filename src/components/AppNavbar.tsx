import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { DropdownMenu } from "radix-ui"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"
import { useAuth } from "@/features/auth/hooks/useAuth"

const languages = [
  { code: "en", label: "English" },
  { code: "de", label: "Deutsch" },
]

export default function AppNavbar() {
  const { i18n } = useTranslation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  const userInitial = user?.email?.[0]?.toUpperCase() ?? "?"

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link to="/dashboard" className="text-lg font-bold tracking-tight">
          Bondity
        </Link>

        <div className="flex items-center gap-2">
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

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {userInitial}
                </span>
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-48 rounded-md border bg-popover p-1 shadow-md"
              >
                <div className="px-2 py-1.5 text-xs text-muted-foreground truncate">
                  {user?.email}
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                <DropdownMenu.Item
                  onSelect={handleSignOut}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent select-none"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </nav>
  )
}
