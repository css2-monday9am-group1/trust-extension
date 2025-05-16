export enum AutoResolvableHost {
  ChatGPT,
  Claude,
  DeepSeek,
  Gemini,
  Grok,
}

export function extractAutoResolvableHostFromURL(url: string): AutoResolvableHost | null {
  if (url.includes('chatgpt.com')) return AutoResolvableHost.ChatGPT
  if (url.includes('claude.ai')) return AutoResolvableHost.Claude
  if (url.includes('chat.deepseek.com')) return AutoResolvableHost.DeepSeek
  if (url.includes('gemini.google.com')) return AutoResolvableHost.Gemini
  if (url.includes('grok.com')) return AutoResolvableHost.Grok
  return null
}

interface HostData {
  icon: string
  name: string
}

export const Hosts: Record<AutoResolvableHost, HostData> = {
  [AutoResolvableHost.ChatGPT]: { name: 'ChatGPT', icon: 'openai.png' },
  [AutoResolvableHost.Claude]: { name: 'Claude', icon: 'claude.png' },
  [AutoResolvableHost.DeepSeek]: { name: 'DeepSeek', icon: 'deepseek.png' },
  [AutoResolvableHost.Gemini]: { name: 'Gemini', icon: 'gemini.png' },
  [AutoResolvableHost.Grok]: { name: 'Grok', icon: 'grok.png' },
}
