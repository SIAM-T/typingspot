"use client";

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/context/auth-context'
import { supabase } from '@/lib/supabase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface UserSettings {
  sound_enabled: boolean
  theme: string
  keyboard_layout: string
  show_live_wpm: boolean
  show_progress_bar: boolean
  font_size: string
}

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    sound_enabled: true,
    theme: 'system',
    keyboard_layout: 'standard',
    show_live_wpm: true,
    show_progress_bar: true,
    font_size: 'medium'
  })
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (!user) return

    const loadSettings = async () => {
      try {
        // Load user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('username, email')
          .eq('id', user.id)
          .single()

        if (userError) throw userError

        setUsername(userData.username)
        setEmail(userData.email)

        // Load user settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (settingsError && settingsError.code !== 'PGRST116') {
          throw settingsError
        }

        if (settingsData) {
          setSettings(settingsData)
        } else {
          // Create default settings
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              ...settings
            })

          if (insertError) throw insertError
        }
      } catch (error) {
        console.error('Error loading settings:', error)
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [user, toast])

  const saveSettings = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Update user settings
      const { error: settingsError } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        })

      if (settingsError) throw settingsError

      // Update username if changed
      if (username !== user.user_metadata.username) {
        // Check if username is available
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('username')
          .eq('username', username)
          .neq('id', user.id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') throw checkError

        if (existingUser) {
          toast({
            title: 'Error',
            description: 'Username is already taken',
            variant: 'destructive'
          })
          return
        }

        // Update username in auth metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { username }
        })

        if (updateError) throw updateError

        // Update username in users table
        const { error: userError } = await supabase
          .from('users')
          .update({ username })
          .eq('id', user.id)

        if (userError) throw userError
      }

      toast({
        title: 'Success',
        description: 'Settings saved successfully'
      })
    } catch (error) {
      console.error('Error saving settings:', error)
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and customize your typing experience
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Account Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Typing Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">
                  Enable keyboard sounds while typing
                </p>
              </div>
              <Switch
                checked={settings.sound_enabled}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, sound_enabled: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Keyboard Layout</Label>
              <Select
                value={settings.keyboard_layout}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, keyboard_layout: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select keyboard layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard QWERTY</SelectItem>
                  <SelectItem value="dvorak">Dvorak</SelectItem>
                  <SelectItem value="colemak">Colemak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Live WPM</Label>
                <p className="text-sm text-muted-foreground">
                  Show real-time WPM while typing
                </p>
              </div>
              <Switch
                checked={settings.show_live_wpm}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, show_live_wpm: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Progress Bar</Label>
                <p className="text-sm text-muted-foreground">
                  Show progress bar during tests
                </p>
              </div>
              <Switch
                checked={settings.show_progress_bar}
                onCheckedChange={(checked) =>
                  setSettings((prev) => ({ ...prev, show_progress_bar: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={settings.font_size}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, font_size: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select font size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </motion.div>
    </div>
  )
} 