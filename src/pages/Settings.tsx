'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useFleetStore } from '@/lib/store'
import {
  Building2, User, Bell, Moon, Sun, Save, Shield,
  Mail, Phone, MapPin, Globe, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  const {
    companyInfo,
    userProfile,
    notifications,
    theme,
    updateCompanyInfo,
    updateUserProfile,
    updateNotifications,
    setTheme
  } = useFleetStore()

  const [isLoading, setIsLoading] = useState(false)

  // Refs for form elements
  const companyNameRef = useRef<HTMLInputElement>(null)
  const companyGstinRef = useRef<HTMLInputElement>(null)
  const companyEmailRef = useRef<HTMLInputElement>(null)
  const companyPhoneRef = useRef<HTMLInputElement>(null)
  const companyWebsiteRef = useRef<HTMLInputElement>(null)
  const companyAddressRef = useRef<HTMLTextAreaElement>(null)

  const userNameRef = useRef<HTMLInputElement>(null)
  const userRoleRef = useRef<HTMLInputElement>(null)
  const userEmailRef = useRef<HTMLInputElement>(null)
  const userPhoneRef = useRef<HTMLInputElement>(null)

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const handleSaveCompany = () => {
    setIsLoading(true)
    const updatedInfo = {
      name: companyNameRef.current?.value || companyInfo.name,
      gstin: companyGstinRef.current?.value || companyInfo.gstin,
      email: companyEmailRef.current?.value || companyInfo.email,
      phone: companyPhoneRef.current?.value || companyInfo.phone,
      website: companyWebsiteRef.current?.value || companyInfo.website,
      address: companyAddressRef.current?.value || companyInfo.address,
    }
    updateCompanyInfo(updatedInfo)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Company information saved successfully')
    }, 500)
  }

  const handleSaveProfile = () => {
    setIsLoading(true)
    const updatedProfile = {
      name: userNameRef.current?.value || userProfile.name,
      role: userRoleRef.current?.value || userProfile.role,
      email: userEmailRef.current?.value || userProfile.email,
      phone: userPhoneRef.current?.value || userProfile.phone,
    }
    updateUserProfile(updatedProfile)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Profile updated successfully')
    }, 500)
  }

  const handleSaveNotifications = () => {
    setIsLoading(true)
    updateNotifications(notifications)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Notification preferences saved')
    }, 500)
  }

  const handleSaveAll = () => {
    handleSaveCompany()
    handleSaveProfile()
    handleSaveNotifications()
  }

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>
          <Button
            onClick={handleSaveAll}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isLoading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          {/* Company Information */}
          <TabsContent value="company">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Company Information</h2>
                  <p className="text-sm text-muted-foreground">Update your company details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    ref={companyNameRef}
                    defaultValue={companyInfo.name}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN/BIN</Label>
                  <Input
                    ref={companyGstinRef}
                    defaultValue={companyInfo.gstin}
                    placeholder="Enter GSTIN/BIN"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    ref={companyEmailRef}
                    type="email"
                    defaultValue={companyInfo.email}
                    placeholder="Enter email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    ref={companyPhoneRef}
                    type="tel"
                    defaultValue={companyInfo.phone}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    ref={companyWebsiteRef}
                    defaultValue={companyInfo.website}
                    placeholder="Enter website URL"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Textarea
                    ref={companyAddressRef}
                    defaultValue={companyInfo.address}
                    placeholder="Enter company address"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSaveCompany}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Company Info
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* User Profile */}
          <TabsContent value="profile">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">User Profile</h2>
                  <p className="text-sm text-muted-foreground">Manage your account details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    ref={userNameRef}
                    defaultValue={userProfile.name}
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    ref={userRoleRef}
                    defaultValue={userProfile.role}
                    placeholder="Enter your role"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    ref={userEmailRef}
                    type="email"
                    defaultValue={userProfile.email}
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    ref={userPhoneRef}
                    type="tel"
                    defaultValue={userProfile.phone}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Notification Preferences */}
          <TabsContent value="notifications">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Notification Preferences</h2>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Email Alerts */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.emailAlerts}
                    onCheckedChange={(checked) =>
                      updateNotifications({ ...notifications, emailAlerts: checked })
                    }
                  />
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive in-app notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      updateNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>

                {/* SMS Alerts */}
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">SMS Alerts</p>
                      <p className="text-sm text-muted-foreground">Receive alerts via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.smsAlerts}
                    onCheckedChange={(checked) =>
                      updateNotifications({ ...notifications, smsAlerts: checked })
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Alert Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Weekly Reports</span>
                      <Switch
                        checked={notifications.weeklyReport}
                        onCheckedChange={(checked) =>
                          updateNotifications({ ...notifications, weeklyReport: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Maintenance Reminders</span>
                      <Switch
                        checked={notifications.maintenanceReminders}
                        onCheckedChange={(checked) =>
                          updateNotifications({ ...notifications, maintenanceReminders: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Fuel Alerts</span>
                      <Switch
                        checked={notifications.fuelAlerts}
                        onCheckedChange={(checked) =>
                          updateNotifications({ ...notifications, fuelAlerts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Driver Alerts</span>
                      <Switch
                        checked={notifications.driverAlerts}
                        onCheckedChange={(checked) =>
                          updateNotifications({ ...notifications, driverAlerts: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vehicle Alerts</span>
                      <Switch
                        checked={notifications.vehicleAlerts}
                        onCheckedChange={(checked) =>
                          updateNotifications({ ...notifications, vehicleAlerts: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-purple-500" />
                  ) : (
                    <Sun className="h-5 w-5 text-orange-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Appearance</h2>
                  <p className="text-sm text-muted-foreground">Customize your app theme</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-purple-500" />
                    ) : (
                      <Sun className="h-5 w-5 text-orange-500" />
                    )}
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        {theme === 'dark' ? 'Dark theme is enabled' : 'Light theme is enabled'}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>

                <div className="p-4 rounded-lg border bg-muted/50">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Theme Preview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === 'light' ? 'border-orange-500 bg-white' : 'border-border bg-gray-100'
                      }`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sun className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">Light</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-200 rounded" />
                        <div className="h-2 w-3/4 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === 'dark' ? 'border-orange-500 bg-gray-900' : 'border-border bg-gray-800'
                      }`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Moon className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium text-white">Dark</span>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-gray-700 rounded" />
                        <div className="h-2 w-3/4 bg-gray-700 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
  )
}
