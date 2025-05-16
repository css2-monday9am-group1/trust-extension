import { AutoResolvableHost, extractAutoResolvableHostFromURL } from '../hosts.js'
import { AutoResolveError, Message } from '../messages.js'
;(() => {
  const host = extractAutoResolvableHostFromURL(location.href)

  if (host !== null) {
    const result = {
      [AutoResolvableHost.ChatGPT]: autoResolveChatGPT,
      [AutoResolvableHost.Claude]: autoResolveClaude,
      [AutoResolvableHost.DeepSeek]: autoResolveDeepSeek,
      [AutoResolvableHost.Gemini]: autoResolveGemini,
      [AutoResolvableHost.Grok]: autoResolveGrok,
    }[host]()

    if (typeof result === 'string') {
      reply({ type: 'auto-resolve-complete', success: false, error: result })
    } else {
      reply({ type: 'auto-resolve-complete', success: true, ...result })
    }
  } else {
    reply({ type: 'auto-resolve-complete', success: false, error: 'unexpected' })
  }
})()

function reply(message: Message) {
  chrome.runtime.sendMessage(message)
}

function autoResolveChatGPT(): AutoResolveError | { prompt: string; response: string } {
  const messages = [...document.querySelectorAll('[data-message-id]')]
  if (messages.length < 2) return 'turn'

  const promptElement = messages[messages.length - 2]
  const responseElement = messages[messages.length - 1]
  if (
    promptElement.getAttribute('data-message-author-role') !== 'user' ||
    responseElement.getAttribute('data-message-author-role') !== 'assistant'
  ) {
    return 'turn'
  }

  const prompt = promptElement.textContent
  const response = responseElement.textContent
  if (!prompt?.trim() || !response?.trim()) return 'empty'

  return { prompt, response }
}

function autoResolveDeepSeek(): AutoResolveError | { prompt: string; response: string } {
  const container = document.querySelectorAll('.ds-markdown--block')[0]?.parentElement?.parentElement
  if (!container) return 'empty'

  const messages = [...container.children]
  if (messages.length % 2 === 1) return 'turn'

  const promptElement = messages[messages.length - 2]
  const responseElement = messages[messages.length - 1]
  if (!responseElement.querySelector('.ds-markdown--block')) return 'turn'

  const prompt = promptElement.textContent
  const response = responseElement.textContent
  if (!prompt?.trim() || !response?.trim()) return 'empty'

  return { prompt, response }
}

function autoResolveGrok(): AutoResolveError | { prompt: string; response: string } {
  const messages = [...document.querySelectorAll('.message-bubble')]
  if (messages.length % 2 === 1) return 'turn'

  const promptElement = messages[messages.length - 2].querySelector('.whitespace-pre-wrap')
  const responseElement = messages[messages.length - 1].querySelector('.response-content-markdown')
  if (!promptElement || !responseElement) return 'turn'

  const prompt = promptElement.textContent
  const response = responseElement.textContent
  if (!prompt?.trim() || !response?.trim()) return 'empty'

  return { prompt, response }
}

function autoResolveGemini(): AutoResolveError | { prompt: string; response: string } {
  const conversations = [...document.querySelectorAll('.conversation-container')]
  if (!conversations.length) return 'empty'

  const promptElement = conversations[conversations.length - 1].querySelector('user-query-content')
  const responseElement = conversations[conversations.length - 1].querySelector('message-content')
  if (!promptElement || !responseElement) return 'turn'

  const prompt = promptElement.textContent
  const response = responseElement.textContent
  if (!prompt?.trim() || !response?.trim()) return 'empty'

  return { prompt, response }
}

function autoResolveClaude(): AutoResolveError | { prompt: string; response: string } {
  const container =
    document.querySelector('.font-user-message')?.parentElement?.parentElement?.parentElement?.parentElement
      ?.parentElement
  if (!container) return 'empty'

  const messages = [...container.children]
  if (messages.length % 2 === 1) return 'turn'

  const promptElement = messages[messages.length - 4].querySelector('.font-user-message')
  const responseElement = messages[messages.length - 3].querySelector('.font-claude-message')
  if (!promptElement || !responseElement) return 'turn'

  const prompt = promptElement.textContent
  const response = responseElement.textContent
  if (!prompt?.trim() || !response?.trim()) return 'empty'

  return { prompt, response }
}
