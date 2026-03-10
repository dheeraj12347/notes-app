import type { Note } from "../types/note";
import { isOnline, queueSyncAction } from "./sync";

const BASE_URL = import.meta.env.VITE_API_URL as string;

if (!BASE_URL) {
	throw new Error(
		"VITE_API_URL is not defined. Please add it to your .env file."
	);
}

/**
 * Fetch notes from MockAPI
 * Supports pagination, search and sorting
 */
export async function getNotes(
	page: number = 1,
	search: string = "",
	sortBy: string = "createdAt",
	order: "asc" | "desc" = "desc"
): Promise<Note[]> {
	try {
		const url = new URL(BASE_URL);

		url.searchParams.set("page", page.toString());
		url.searchParams.set("limit", "20");
		url.searchParams.set("sortBy", sortBy);
		url.searchParams.set("order", order);

		if (search) {
			url.searchParams.set("search", search);
		}

		const res = await fetch(url.toString());

		if (!res.ok) {
			throw new Error(`Failed to fetch notes: ${res.status}`);
		}

		const data = await res.json();

		return data as Note[];
	} catch (error) {
		console.error("getNotes error:", error);
		throw error;
	}
}

/**
 * Create new note
 */
export async function createNote(note: Partial<Note>, isSyncing = false): Promise<Note> {
	if (!isOnline() && !isSyncing) {
		queueSyncAction({ type: "CREATE", payload: note });
		// Return optimistic fake note
		return { ...note, id: `temp-${Date.now()}` } as Note;
	}

	try {
		const res = await fetch(BASE_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(note)
		});

		if (!res.ok) {
			throw new Error(`Failed to create note: ${res.status}`);
		}

		const data = await res.json();

		return data as Note;
	} catch (error) {
		console.error("createNote error:", error);
		if (!isSyncing) {
			queueSyncAction({ type: "CREATE", payload: note });
			return { ...note, id: `temp-${Date.now()}` } as Note;
		}
		throw error;
	}
}

/**
 * Update note
 */
export async function updateNote(
	id: string,
	note: Partial<Note>,
	isSyncing = false
): Promise<Note> {
	// Don't update temporary notes, wait for them to sync and get real IDs
	if (id.startsWith('temp-')) {
		console.warn("Attempted to update a temporary offline note. Wait for sync.");
		return { id, ...note } as Note;
	}

	if (!isOnline() && !isSyncing) {
		queueSyncAction({ type: "UPDATE", id, payload: note });
		return { id, ...note } as Note;
	}

	try {
		const res = await fetch(`${BASE_URL}/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(note)
		});

		if (!res.ok) {
			throw new Error(`Failed to update note: ${res.status}`);
		}

		const data = await res.json();

		return data as Note;
	} catch (error) {
		console.error("updateNote error:", error);
		if (!isSyncing) {
			queueSyncAction({ type: "UPDATE", id, payload: note });
			return { id, ...note } as Note;
		}
		throw error;
	}
}

/**
 * Delete note
 */
export async function deleteNote(id: string, isSyncing = false): Promise<void> {
	// If it's a temporary note, just ignore the API call
	if (id.startsWith('temp-')) {
		return;
	}

	if (!isOnline() && !isSyncing) {
		queueSyncAction({ type: "DELETE", id });
		return;
	}

	try {
		const res = await fetch(`${BASE_URL}/${id}`, {
			method: "DELETE"
		});

		if (!res.ok) {
			throw new Error(`Failed to delete note: ${res.status}`);
		}
	} catch (error) {
		console.error("deleteNote error:", error);
		if (!isSyncing) {
			queueSyncAction({ type: "DELETE", id });
			return;
		}
		throw error;
	}
}