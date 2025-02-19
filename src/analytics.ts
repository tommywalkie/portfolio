export function injectLiwanScript(entity: string) {
  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://liwan.tommywalkie.com/script.js'
  script.dataset.entity = entity
  document.head.appendChild(script)
}
