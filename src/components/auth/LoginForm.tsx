import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (user: { name: string; email: string }, isSignUp: boolean) => void;
  showRegistrationByDefault?: boolean;
}

export const LoginForm = ({ onLogin, showRegistrationByDefault = false }: LoginFormProps) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegister, setShowRegister] = useState(showRegistrationByDefault);
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  const [registerError, setRegisterError] = useState('');
  const [registerShowPassword, setRegisterShowPassword] = useState(false);

  // LOGIN FLOW
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract name from email for demo purposes
    const name = form.email.split('@')[0] || 'User';
    onLogin({ name, email: form.email }, false);
  };

  // SOCIAL LOGIN HANDLERS
  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
    const name = 'Google User';
    const email = 'google@example.com';
    onLogin({ name, email }, false);
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    console.log('Facebook login clicked');
    const name = 'Facebook User';
    const email = 'facebook@example.com';
    onLogin({ name, email }, false);
  };

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple login clicked');
    const name = 'Apple User';
    const email = 'apple@example.com';
    onLogin({ name, email }, false);
  };

  const handleInstagramLogin = () => {
    // TODO: Implement Instagram OAuth
    console.log('Instagram login clicked');
    const name = 'Instagram User';
    const email = 'instagram@example.com';
    onLogin({ name, email }, false);
  };

  // REGISTER FLOW
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setRegisterError('Please fill in all fields.');
      return;
    }
    if (registerForm.password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }
    // Registration successful, trigger onboarding
    onLogin({ name: registerForm.name, email: registerForm.email }, true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f6ffe0] to-[#DAF7A6] px-4 py-8">
      <div className="flex w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-green-600/30 backdrop-blur-lg">
        {/* Left: AI Bot */}
        <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-gradient-to-br from-[#DAF7A6] to-[#b6e07d] p-8">
          <img
            src="/images/chatbot.png"
            alt="AI Bot"
            className="w-48 h-48 object-contain drop-shadow-2xl animate-float"
            style={{ filter: 'drop-shadow(0 0 40px #DAF7A6)' }}
          />
          <h2 className="text-3xl font-extrabold text-[#333] mt-6 text-center drop-shadow-lg">
            {' '}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent font-black tracking-wider">
              Habitude
            </span>
          </h2>
          <p className="text-[#333] text-xl font-light italic text-center mt-4 max-w-md drop-shadow-lg leading-relaxed">
            <span className="font-semibold text-purple-600">Greatness</span> Begins with{' '}
            <span className="font-bold text-blue-600 underline decoration-2 underline-offset-4">Good Habits</span>
          </p>
        </div>
        {/* Right: Login/Register Form */}
        <div className="flex-1 flex flex-col justify-center items-center bg-white/90 p-6 md:p-8">
          {!showRegister ? (
            <>
              <form onSubmit={handleLogin} className="w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="w-3 h-3 bg-[#DAF7A6] rounded-full mr-2 animate-pulse"></span>
                    <h3 className="text-xl font-bold text-[#333]">Welcome!</h3>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="h-10 flex items-center justify-center gap-2 rounded-lg border border-[#DAF7A6] bg-white hover:bg-[#f6ffe0] text-[#333] text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="h-10 flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Continue with Facebook
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleAppleLogin}
                    className="h-10 flex items-center justify-center gap-2 rounded-lg border border-[#333] bg-black hover:bg-gray-900 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Continue with Apple
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleInstagramLogin}
                    className="h-10 flex items-center justify-center gap-2 rounded-lg border border-pink-600 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    Continue with Instagram
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#DAF7A6]"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-[#7a9c3a]">or continue with email</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-4 rounded-lg border border-[#DAF7A6] focus:border-[#b6e07d] focus:ring-2 focus:ring-[#DAF7A6] bg-[#f6ffe0] text-[#333] text-base outline-none transition"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full h-10 px-4 rounded-lg border border-[#DAF7A6] focus:border-[#b6e07d] focus:ring-2 focus:ring-[#DAF7A6] bg-[#f6ffe0] text-[#333] text-base outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-[#7a9c3a] hover:text-[#b6e07d] text-sm"
                    tabIndex={-1}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                
                <button
                  type="submit"
                  className="w-full h-10 rounded-lg bg-[#DAF7A6] hover:bg-[#b6e07d] text-[#333] font-semibold text-sm shadow-lg transition-all duration-200 hover:shadow-xl mt-4"
                >
                  Enter into your habits
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-[#7a9c3a] text-sm font-medium"
                >
                  First time? please join here!
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister} className="w-full max-w-md">
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="w-3 h-3 bg-[#DAF7A6] rounded-full mr-2 animate-pulse"></span>
                    <h3 className="text-xl font-bold text-[#333]">Join us today</h3>
                  </div>
                  <p className="text-gray-600 text-sm">Create your account in just a few steps</p>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="off"
                    className="w-full h-10 px-4 rounded-lg border border-[#DAF7A6] focus:border-[#b6e07d] focus:ring-2 focus:ring-[#DAF7A6] bg-[#f6ffe0] text-[#333] text-base outline-none transition-all duration-200"
                  />
                  
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    required
                    autoComplete="off"
                    className="w-full h-10 px-4 rounded-lg border border-[#DAF7A6] focus:border-[#b6e07d] focus:ring-2 focus:ring-[#DAF7A6] bg-[#f6ffe0] text-[#333] text-base outline-none transition-all duration-200"
                  />
                  
                  <div className="relative">
                    <input
                      type={registerShowPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Create password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      required
                      autoComplete="new-password"
                      className="w-full h-10 px-4 pr-12 rounded-lg border border-[#DAF7A6] focus:border-[#b6e07d] focus:ring-2 focus:ring-[#DAF7A6] bg-[#f6ffe0] text-[#333] text-base outline-none transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setRegisterShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7a9c3a] hover:text-[#b6e07d] text-sm transition-colors"
                      tabIndex={-1}
                    >
                      {registerShowPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {registerError && (
                  <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    {registerError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full h-10 mt-6 rounded-lg bg-[#DAF7A6] hover:bg-[#b6e07d] text-[#333] font-semibold text-sm shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Create Account
                </button>

                <div className="mt-4 text-center">
                  <p className="text-gray-500 text-xs mb-3">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="text-[#7a9c3a] text-sm font-semibold"
                  >
                    Already have an account? Sign in
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
      {/* Floating animation for bot */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
          100% { transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};
