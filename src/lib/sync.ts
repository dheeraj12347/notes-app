import { getLocal, saveLocal } from "./storage";
import { createNote, updateNote, deleteNote } from "./api";
import { isOnline as isOnlineStore, syncing } from "../stores/notesStore";
import type { Note } from "../types/note";

type SyncAction = 
	| { type: "CREATE"; payload: Partial<Note> }
	| { type: "UPDATE"; id: string; payload: Partial<Note> }
	| { type: "DELETE"; id: string };

const SYNC_KEY = "offline_sync_queue";

// Initialize online status store on client-side
if (typeof window !== "undefined") {
	isOnlineStore.set(navigator.onLine);

	window.addEventListener("online", () => {
		isOnlineStore.set(true);
		flushSyncQueue();
	});

	window.addEventListener("offline", () => {
		isOnlineStore.set(false);
	});
}

export function isOnline(): boolean {
	return typeof navigator !== "undefined" ? navigator.onLine : true;
}

export function queueSyncAction(action: SyncAction) {
	const queue: SyncAction[] = getSyncQueue();
	queue.push(action);
	saveLocal({ [SYNC_KEY]: queue });
}

function getSyncQueue(): SyncAction[] {
	const data = getLocal();
	return data[SYNC_KEY] || [];
}

export async function flushSyncQueue() {
	if (!isOnline()) return;

	const queue = getSyncQueue();
	if (queue.length === 0) return;

	syncing.set(true);

	try {
		for (const action of queue) {
			switch (action.type) {
				case "CREATE":
					await createNote(action.payload, true);
					break;
				case "UPDATE":
					await updateNote(action.id, action.payload, true);
					break;
				case "DELETE":
					await deleteNote(action.id, true);
					break;
			}
		}

		// Clear the queue after successful sync
		const data = getLocal();
		delete data[SYNC_KEY];
		saveLocal(data);
	} catch (error) {
		console.error("Failed to flush sync queue:", error);
	} finally {
		syncing.set(false);
	}
}