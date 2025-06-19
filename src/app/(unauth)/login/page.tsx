"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useNavigate } from '@/hooks/useNavigate';
import { toastError } from '@/utils/toast';
import { z } from 'zod';
import Loader from '@/components/Loader';
import { useEffect, useState } from 'react';
import { User, userSchema } from '@/schemas/user/login.schema';

const Login = () => {
  // Hooks
  const session = useSession();
  const searchParams = useSearchParams();
  const navigate = useNavigate();
  
  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  // State
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (session.status === "authenticated") {
      const redirect_url = searchParams.get("redirect_url");
      if (redirect_url) {
        if (redirect_url.includes("https")) {
          setTimeout(() => {
            window.location.href = redirect_url;
          }, 300);
        } else {
          navigate(redirect_url);
        }
      } else {
        navigate("/");
      }
    }
  }, [session.status, navigate, searchParams]);

  // Form submission
  const onSubmit = async (data: User) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: `${window.location.origin}`,
        redirect: false,
      });

      if (result?.error) {
        toastError(result.error);
        return;
      }

      if (result?.url) {
        navigate(result.url);
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to eCastle</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Login {isSubmitting && <Loader/>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;