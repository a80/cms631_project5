/* JS logic */

$(document).ready(function() {
	$('#mapDiv').hide(); 

	$('#submitStateButton').click(function() {
		var state = $('#stateFormField').val(); 
		console.log(state);

		//TODO: feed state into the map

		$('#formEntryDiv').hide(); 
		$('#mapDiv').show(); 
	}); 

}); 
