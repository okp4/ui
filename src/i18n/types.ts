import type { DeepReadonly } from "superTypes"

export type TLanguage = DeepReadonly<{
    title: string,
    value: string
}>

export type TLanguages = TLanguage[]
