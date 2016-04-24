/* JS logic */

$(document).ready(function() {
	$('#mapDiv').hide(); 
	$('#resultsDiv').hide(); 

	$('#submitStateButton').click(function() {
		var state = $('#stateFormField').val(); 
		console.log(state);

		//TODO: feed state into the map

		$('#formEntryDiv').hide(); 
		$('#logo').hide(); 
		$('#mapDiv').show();
	}); 

	$('#dummyButton').click(function() {
		$('#mapDiv').hide();
		$('#resultsDiv').show(); 
	});

}); 
