import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock, Key } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (role: string) => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      onLogin('Super Admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-[#DAF7A6] rounded-full w-fit">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <p className="text-gray-600">Habitude AI Management Portal</p>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@habitude.ai"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubmit('password')} 
                className="w-full bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </TabsContent>
            
            <TabsContent value="otp" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-otp">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email-otp"
                    type="email"
                    placeholder="admin@habitude.ai"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                Send OTP
              </Button>
              
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    value={loginData.otp}
                    onChange={(e) => setLoginData(prev => ({ ...prev, otp: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button 
                onClick={() => handleSubmit('otp')} 
                className="w-full bg-[#DAF7A6] hover:bg-[#c4f085] text-gray-900"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Secure admin access with role-based permissions
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};