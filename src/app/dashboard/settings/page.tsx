import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { User, Palette } from 'lucide-react'
import { api } from '~/trpc/server'
import { ProfileForm } from './profile-form'
import { ThemeToggle } from './theme-toggle'

export default async function SettingsPage() {
  const userInfo = await api.user.getProfile()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </header>

        <div className="space-y-6">
          {/* Account Settings */}
          <section aria-labelledby="account-settings-title">
            <Card>
              <CardHeader>
                <CardTitle id="account-settings-title" className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" aria-hidden="true" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Update your personal information and email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    {userInfo.image ? (
                      <AvatarImage src={userInfo.image} alt={userInfo.name} />
                    ) : (
                      <AvatarFallback className="text-2xl">
                        {userInfo.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{userInfo.name}</p>
                    <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                  </div>
                </div>

                <Separator />

                <ProfileForm initialName={userInfo.name} email={userInfo.email} />
              </CardContent>
            </Card>
          </section>

          {/* Appearance Settings */}
          <section aria-labelledby="appearance-settings-title">
            <Card>
              <CardHeader>
                <CardTitle id="appearance-settings-title" className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" aria-hidden="true" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how the app looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Theme Preference</p>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  )
}
