export type JsonPrimitive = string | number | boolean | null

export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export type JsonArray = readonly JsonValue[]

export type JsonObject = {
    readonly [key: string]: JsonValue
}
