import { routing } from './routing'
import enAbout from '@/locales/en/about.json'
import enAdmin from '@/locales/en/admin.json'
import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enProjects from '@/locales/en/projects.json'
import ukAbout from '@/locales/uk/about.json'
import ukAdmin from '@/locales/uk/admin.json'
import ukCommon from '@/locales/uk/common.json'
import ukHome from '@/locales/uk/home.json'
import ukProjects from '@/locales/uk/projects.json'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async ({ requestLocale }) => {
    const requested = await requestLocale
    const locale = hasLocale(routing.locales, requested)
        ? requested
        : routing.defaultLocale

    const messages = {
        en: {
            common: enCommon,
            home: enHome,
            about: enAbout,
            projects: enProjects,
            admin: enAdmin,
        },
        uk: {
            common: ukCommon,
            home: ukHome,
            about: ukAbout,
            projects: ukProjects,
            admin: ukAdmin,
        },
    }

    return {
        locale,
        messages: messages[locale],
    }
})
