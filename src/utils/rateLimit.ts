const RATE_LIMIT_KEY = 'backsnap_rate_limit';
const MAX_REQUESTS_PER_DAY = 20;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface RateLimitData {
  count: number;
  resetTime: number;
}

export function checkRateLimit(): boolean {
  const now = Date.now();
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  
  let rateLimitData: RateLimitData;
  
  if (stored) {
    rateLimitData = JSON.parse(stored);
    
    // Reset if 24 hours have passed
    if (now >= rateLimitData.resetTime) {
      rateLimitData = {
        count: 0,
        resetTime: now + ONE_DAY_MS,
      };
    }
  } else {
    rateLimitData = {
      count: 0,
      resetTime: now + ONE_DAY_MS,
    };
  }
  
  // Check if limit exceeded
  if (rateLimitData.count >= MAX_REQUESTS_PER_DAY) {
    return false;
  }
  
  // Increment count and save
  rateLimitData.count++;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(rateLimitData));
  
  return true;
}

export function getRemainingRequests(): number {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  
  if (!stored) {
    return MAX_REQUESTS_PER_DAY;
  }
  
  const rateLimitData: RateLimitData = JSON.parse(stored);
  const now = Date.now();
  
  // Reset if 24 hours have passed
  if (now >= rateLimitData.resetTime) {
    return MAX_REQUESTS_PER_DAY;
  }
  
  return Math.max(0, MAX_REQUESTS_PER_DAY - rateLimitData.count);
}

export function getResetTime(): Date {
  const stored = localStorage.getItem(RATE_LIMIT_KEY);
  
  if (!stored) {
    return new Date(Date.now() + ONE_DAY_MS);
  }
  
  const rateLimitData: RateLimitData = JSON.parse(stored);
  return new Date(rateLimitData.resetTime);
}