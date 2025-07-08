
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  Bell,
  Save,
  Palette,
  Eye,
  RotateCcw
} from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { FontColorDemo } from '../FontColorDemo';

export const AdminSettings = () => {
  const { settings, updateSetting, applyFontColors, resetToDefaults } = useAdminSettings();

  const handleSettingChange = (key: string, value: any) => {
    updateSetting(key as keyof typeof settings, value);
  };

  const togglePageVisibility = (pageKey: string) => {
    const currentValue = settings[pageKey as keyof typeof settings] as boolean;
    updateSetting(pageKey as keyof typeof settings, !currentValue);
  };

  const handleSaveAll = () => {
    applyFontColors();
    // You can add additional save logic here (API calls, etc.)
    console.log('All settings saved:', settings);
  };

  return (
    <div className="space-y-6 text-[#222]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p>Configure system-wide settings and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={resetToDefaults}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>General Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="userRegistration">Allow User Registration</Label>
              <Switch
                id="userRegistration"
                checked={settings.userRegistration}
                onCheckedChange={(checked) => handleSettingChange('userRegistration', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Font Color Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Font Colors</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="primaryTextColor">Primary Text Color</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="primaryTextColor"
                  type="color"
                  value={settings.primaryTextColor}
                  onChange={(e) => handleSettingChange('primaryTextColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.primaryTextColor}
                  onChange={(e) => handleSettingChange('primaryTextColor', e.target.value)}
                  placeholder="#1f2937"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="secondaryTextColor">Secondary Text Color</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="secondaryTextColor"
                  type="color"
                  value={settings.secondaryTextColor}
                  onChange={(e) => handleSettingChange('secondaryTextColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.secondaryTextColor}
                  onChange={(e) => handleSettingChange('secondaryTextColor', e.target.value)}
                  placeholder="#6b7280"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accentTextColor">Accent Text Color</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="accentTextColor"
                  type="color"
                  value={settings.accentTextColor}
                  onChange={(e) => handleSettingChange('accentTextColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.accentTextColor}
                  onChange={(e) => handleSettingChange('accentTextColor', e.target.value)}
                  placeholder="#3b82f6"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex space-x-2 mt-1">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  className="w-16 h-10"
                />
                <Input
                  type="text"
                  value={settings.backgroundColor}
                  onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <Button 
              onClick={applyFontColors}
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Apply Font Colors
            </Button>
          </CardContent>
        </Card>

        {/* Font Color Preview */}
        <div className="lg:col-span-2">
          <FontColorDemo />
        </div>

        {/* Page Visibility Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Page Visibility</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="showMoodTracker">Mood Tracker</Label>
                <Switch
                  id="showMoodTracker"
                  checked={settings.showMoodTracker}
                  onCheckedChange={() => togglePageVisibility('showMoodTracker')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showHabitTracker">Habit Tracker</Label>
                <Switch
                  id="showHabitTracker"
                  checked={settings.showHabitTracker}
                  onCheckedChange={() => togglePageVisibility('showHabitTracker')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showGoals">Goals</Label>
                <Switch
                  id="showGoals"
                  checked={settings.showGoals}
                  onCheckedChange={() => togglePageVisibility('showGoals')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showAnalytics">Analytics</Label>
                <Switch
                  id="showAnalytics"
                  checked={settings.showAnalytics}
                  onCheckedChange={() => togglePageVisibility('showAnalytics')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showSocialSharing">Social Sharing</Label>
                <Switch
                  id="showSocialSharing"
                  checked={settings.showSocialSharing}
                  onCheckedChange={() => togglePageVisibility('showSocialSharing')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showRewards">Rewards</Label>
                <Switch
                  id="showRewards"
                  checked={settings.showRewards}
                  onCheckedChange={() => togglePageVisibility('showRewards')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showChallenges">Challenges</Label>
                <Switch
                  id="showChallenges"
                  checked={settings.showChallenges}
                  onCheckedChange={() => togglePageVisibility('showChallenges')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showAICoach">AI Coach</Label>
                <Switch
                  id="showAICoach"
                  checked={settings.showAICoach}
                  onCheckedChange={() => togglePageVisibility('showAICoach')}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showAccountabilityBuddies">Accountability Buddies</Label>
                <Switch
                  id="showAccountabilityBuddies"
                  checked={settings.showAccountabilityBuddies}
                  onCheckedChange={() => togglePageVisibility('showAccountabilityBuddies')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
              />
            </div>

            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="maxHabitsPerUser">Max Habits per User</Label>
              <Input
                id="maxHabitsPerUser"
                type="number"
                value={settings.maxHabitsPerUser}
                onChange={(e) => handleSettingChange('maxHabitsPerUser', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Save Button */}
      <div className="flex justify-end">
                  <Button className="bg-[#DAF7A6] hover:bg-[#c4f085] border border-[#DAF7A6]" onClick={handleSaveAll}>
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
      </div>
    </div>
  );
};