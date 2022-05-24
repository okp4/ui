
import React from 'react'
import {  loadTranslations, updateLanguage } from '../../../i18n/utils'
import type { I18nResource } from '../../../i18n/utils'
import type { TLanguage,TLanguages } from '../../../i18n/types'
import { Typography } from '../typography/Typography'
import languageSwitcher_en from './i18n/languageSwitcher_en.json'
import languageSwitcher_fr from './i18n/languageSwitcher_fr.json'
import { useTranslation } from 'hook/useTranslation'
import './languageSwitcher.scss'


const languagesTranslation : I18nResource[] = [
    {lng: "en", namespace: "languageSwitcher", resource: languageSwitcher_en},
    {lng: "fr", namespace: "languageSwitcher", resource: languageSwitcher_fr}
  ]
  
loadTranslations(languagesTranslation)

const languages: TLanguages = [{ title:'English', value:'en-EN'}, {title:'Français', value: 'fr-FR'}]


export const LanguageSwitcher: React.FC= (): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/typedef
    const { t } = useTranslation("languageSwitcher")

    const handleLanguageUpdate = (language:string)=>():void=>{
        updateLanguage(language)
    }

    return (
    <div className='language-switcher-story-main'>
        <p>{t('languages')}</p>
        {languages.map((language:Readonly<TLanguage>) => 
            <Typography as="div" fontSize='small' fontWeight='light' key={language.title} >
                <p onClick={handleLanguageUpdate(language.value)}>{language.title}</p>
            </Typography>
        )}
    </div>)
}