import { writable } from "svelte/store"
import type { Note } from "../types/note"

export const notes = writable<Note[]>([])
export const loading = writable<boolean>(false)
export const page = writable<number>(1)
export const search = writable<string>("")
export const sortBy = writable<string>("createdAt")
export const order = writable<"asc" | "desc">("desc")
export const isOnline = writable<boolean>(true)
export const syncing = writable<boolean>(false)
export const accentColor = writable<string>("blue")
export const hasMore = writable<boolean>(true)