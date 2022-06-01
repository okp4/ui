import type { DeepReadonly } from "superTypes"

type LngCode = string

export type Language = DeepReadonly<{
    name: string,
    value: LngCode
}>

export type Languages = Language[]
