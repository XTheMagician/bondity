import { useTranslation } from "react-i18next"
import Navbar from "@/components/Navbar"

export default function LandingPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("welcome")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("subtitle")}</p>
      </div>
    </div>
  )
}
