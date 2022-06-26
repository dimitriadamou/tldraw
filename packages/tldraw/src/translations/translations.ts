import ar from './ar.json'
import en from './en.json'
import fr from './fr.json'
import it from './it.json'
import ko_kr from './ko-kr.json'
import zh_cn from './zh-cn.json'

export const TRANSLATIONS: TDTranslations = [
  { code: 'en', label: 'English', messages: en },
  { code: 'ar', label: 'عربي', messages: ar },
  { code: 'fr', label: 'Français', messages: fr },
  { code: 'it', label: 'Italiano', messages: it },
  { code: 'ko-kr', label: '한국어', messages: ko_kr },
  { code: 'zh-cn', label: 'Chinese - Simplified', messages: zh_cn },
]

/* ---------- Derived Types (do not change) --------- */

export type TDTranslation = {
  readonly code: string
  readonly label: string
  readonly messages: typeof en
}

export type TDTranslations = TDTranslation[]

export type TDLanguage = TDTranslations[number]['code']
