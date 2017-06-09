import dispatcher from "../dispatcher";

export function addJSONItem(text){
	dispatcher.dispatch({
		type: "ADD_JSON",
		text,
	});
}



