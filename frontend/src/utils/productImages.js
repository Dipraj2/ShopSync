const CATEGORY_KEYWORDS = {
  laptop: ['laptop', 'notebook', 'macbook', 'thinkpad', 'chromebook', 'ultrabook'],
  phone: ['phone', 'iphone', 'pixel', 'galaxy', 'oneplus', 'xiaomi', 'motorola', 'nokia', 'android', 'ios'],
  headphones: ['headphone', 'earphone', 'earbud', 'audio', 'sound', 'bose', 'sony wh', 'sennheiser', 'jbl'],
  tablet: ['tablet', 'ipad', 'surface', 'tab'],
  charger: ['charger', 'charging', 'usb-c', 'magsafe', 'power'],
  monitor: ['monitor', 'display', 'ultrawide', 'ultrasharp', 'ultragear'],
  keyboard: ['keyboard', 'keychron', 'mechanical'],
  mouse: ['mouse', 'trackpad'],
  smartwatch: ['watch', 'smartwatch', 'fitbit', 'garmin', 'wearable'],
  camera: ['camera', 'gopro', 'vlog'],
  speaker: ['speaker', 'sonos', 'spatial'],
}

const GRADIENT_PALETTES = [
  ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'], ['#f5576c', '#ff6f91'],
  ['#667eea', '#43e97b'],
]

const CATEGORY_ICONS = {
  laptop: '💻', phone: '📱', headphones: '🎧', tablet: '📋', charger: '🔌',
  monitor: '🖥️', keyboard: '⌨️', mouse: '🖱️', smartwatch: '⌚', camera: '📷', speaker: '🔊',
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) { hash = ((hash << 5) - hash) + str.charCodeAt(i); hash |= 0 }
  return Math.abs(hash)
}

export function getProductCategory(name = '') {
  const lower = name.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat
  }
  return 'laptop'
}

export function getProductGradient(name, id) {
  const hash = hashCode(id || name)
  return GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length]
}

export function getCategoryIcon(name) {
  const cat = getProductCategory(name)
  return CATEGORY_ICONS[cat] || '📦'
}
