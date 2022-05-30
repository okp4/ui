import type { DeepReadonly } from "superTypes"

export type TLanguage = DeepReadonly<{
    name: string,
    value: string
}>

export type TLanguages = TLanguage[]
