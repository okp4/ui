import type { DeepReadonly } from "superTypes"

type isoLng = string

export type Language = DeepReadonly<{
    name: string,
    iso: isoLng
}>

export type Languages = Language[]
