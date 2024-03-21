import defaultSettings from '@/settings'

const title = typeof defaultSettings.title !== 'string' ? '管理平台' : defaultSettings.title

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
