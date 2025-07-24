'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        router.push('/dashboard'); // redirect to your protected route
      } else {
        router.push('/login');
      }
    };

    handleRedirect();
  }, [router]);

  return <p>Redirecting...</p>;
}
