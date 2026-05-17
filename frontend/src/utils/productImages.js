const CATEGORY_KEYWORDS = {
  laptop:     ['laptop', 'notebook', 'macbook', 'thinkpad', 'chromebook', 'ultrabook'],
  phone:      ['phone', 'iphone', 'pixel', 'galaxy', 'oneplus', 'xiaomi', 'motorola', 'nokia', 'android', 'ios'],
  headphones: ['headphone', 'earphone', 'earbud', 'audio', 'sound', 'bose', 'sony wh', 'sennheiser', 'jbl'],
  tablet:     ['tablet', 'ipad', 'surface', 'tab'],
  charger:    ['charger', 'charging', 'usb-c', 'magsafe', 'power'],
  monitor:    ['monitor', 'display', 'ultrawide', 'ultrasharp', 'ultragear'],
  keyboard:   ['keyboard', 'keychron', 'mechanical'],
  mouse:      ['mouse', 'trackpad'],
  smartwatch: ['watch', 'smartwatch', 'fitbit', 'garmin', 'wearable'],
  camera:     ['camera', 'gopro', 'vlog'],
  speaker:    ['speaker', 'sonos', 'spatial'],
}

const CATEGORY_IMAGE_IDS = {
  laptop:     [0, 1, 2, 3, 4, 5, 6, 7],
  phone:      [10, 11, 12, 13, 14, 15, 16],
  headphones: [20, 21, 22, 23, 24],
  tablet:     [30, 31, 32, 33],
  charger:    [40, 41, 42, 43],
  monitor:    [50, 51, 52, 53],
  keyboard:   [60, 61, 62],
  mouse:      [70, 71, 72],
  smartwatch: [80, 81, 82, 83],
  camera:     [90, 91, 92],
  speaker:    [95, 96, 97],
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getProductCategory(name = '') {
  const lower = name.toLowerCase()
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) return cat
  }
  return 'laptop'
}

export function getProductImage(name, id) {
  const cat = getProductCategory(name)
  const ids = CATEGORY_IMAGE_IDS[cat] || CATEGORY_IMAGE_IDS.laptop
  const hash = hashCode(id || name)
  const seed = ids[hash % ids.length] + hash
  return `https://picsum.photos/seed/shopsync${seed}/400/240`
}

const GRADIENT_PALETTES = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
  ['#e0c3fc', '#8ec5fc'],
  ['#f5576c', '#ff6f91'],
  ['#667eea', '#43e97b'],
]

export function getProductGradient(name, id) {
  const hash = hashCode(id || name)
  return GRADIENT_PALETTES[hash % GRADIENT_PALETTES.length]
}
