import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

import enCommon from '@/locales/en/common.json'
import enHome from '@/locales/en/home.json'
import enAbout from '@/locales/en/about.json'
import enProjects from '@/locales/en/projects.json'

import ukCommon from '@/locales/uk/common.json'
import ukHome from '@/locales/uk/home.json'
import ukAbout from '@/locales/uk/about.json'
import ukProjects from '@/locales/uk/projects.json'

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
            projects: enProjects
        },
        uk: {
            common: ukCommon,
            home: ukHome,
            about: ukAbout,
            projects: ukProjects
        }
    }

    return {
        locale,
        messages: messages[locale]
    }
})
