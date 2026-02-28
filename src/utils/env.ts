export function isMockEnvironment(): boolean {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
  
  if (!apiBaseUrl || apiBaseUrl === '') {
    return true
  }
  
  if (apiBaseUrl.includes('mock') || apiBaseUrl.includes('localhost')) {
    return true
  }
  
  return false
}

export function shouldUseMockData(): boolean {
  return true
}
