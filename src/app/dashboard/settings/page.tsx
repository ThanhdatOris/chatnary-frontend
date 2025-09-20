import ClientOnly from '@/components/ClientOnly'
import SettingsPageClient from '@/components/SettingsPageClient'
import Loading from '@/components/ui/Loading'

export default function SettingsPage() {
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen gradient-bg">
          <div className="flex items-center justify-center min-h-screen">
            <Loading size="lg" />
          </div>
        </div>
      }
    >
      <SettingsPageClient />
    </ClientOnly>
  )
}