import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

const MAX_REQUESTS_PER_DAY = 20;

export function useRateLimit() {
  const { user } = useAuth();
  const [requestCount, setRequestCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const checkRateLimit = async () => {
    if (!user) return false;

    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { count, error } = await supabase
        .from('images')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;

      setRequestCount(count || 0);
      return (count || 0) < MAX_REQUESTS_PER_DAY;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getRemainingRequests = () => {
    return Math.max(0, MAX_REQUESTS_PER_DAY - requestCount);
  };

  useEffect(() => {
    if (user) {
      checkRateLimit();
    }
  }, [user]);

  return {
    requestCount,
    remainingRequests: getRemainingRequests(),
    maxRequests: MAX_REQUESTS_PER_DAY,
    canMakeRequest: requestCount < MAX_REQUESTS_PER_DAY,
    checkRateLimit,
    loading,
  };
}