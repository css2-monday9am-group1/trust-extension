import { Message } from '../messages'

chrome.contextMenus.onClicked.addListener(info => {
  const message: Message = { type: 'trigger-manual', selection: info.selectionText! }
  chrome.action.openPopup(() => chrome.runtime.sendMessage(message))
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Run Trust Analysis',
    contexts: ['selection'],
    id: 'run'
  })
})
