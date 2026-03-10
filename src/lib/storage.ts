export function saveLocal(data:any){

	localStorage.setItem("notes",JSON.stringify(data))
}

export function getLocal(){

	const data = localStorage.getItem("notes")

	return data ? JSON.parse(data) : []
}