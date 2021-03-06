/*
Copyright 2012 Bruno Hautzenberger

This file is part of Pingeborg.

Pingeborg is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published 
by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
Pingeborg is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of 
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
You should have received a copy of the GNU General Public License along with Pingeborg. If not, see http://www.gnu.org/licenses/.
*/ 

//Global Members
var markers = [];
var tagsWithoutDownloads = [];
var tagsWithoutMarkers = [];

jQuery(document).ready(function($) {
	pingeb_show_loading("");

	//load markers
	var data = {
		action: 'pingeb_get_get_markers'
	};

	jQuery.post(ajaxurl, data, function(response) {
		markers = JSON.parse(response);		
		pingeb_hide_loading();
	});	
});

function pingeb_show_maintenance_list(){
	var mode = document.getElementById('pingeb_tag_maintenance_mode').value;
	var list = document.getElementById('pingeb_tag_maintenance_list');
	
	if(mode == 1){
		pingeb_show_loading("");
		
		//load tags without downloads
		data = {
			action: 'pingeb_get_tag_without_downloads'
		};

		jQuery.post(ajaxurl, data, function(response) {
			tagsWithoutDownloads = JSON.parse(response);
			
			var html = "";
			//header
			html +="<div class='pingeb-table-header'>";
			html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>Marker Id</div>";
			html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>Marker Name</div>";
			html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>Last Download</div>";
			html +="</div>";
			
			//tags without downloads
			for(var i = 0; i < tagsWithoutDownloads.length; i++){
				html +="<div class='pingeb-table-row'>";
				html +="<div class='pingeb-table-col-mm'>" + tagsWithoutDownloads[i]['id'] + "</div>";
				html +="<div class='pingeb-table-col-mm'>" + tagsWithoutDownloads[i]['markername'] + "</div>";
				html +="<div class='pingeb-table-col-mm'>" + tagsWithoutDownloads[i]['last_download'] + "</div>";
				html +="</div>";
			}
			
			//table footer
			html +="<div class='pingeb-table-header'>";
			html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
			html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
			html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
			html +="</div>";
			
			list.innerHTML = html;
			
			pingeb_hide_loading();
		});
	} 
	
	if(mode == 2){
		pingeb_show_loading("");
		
		//load tags without downloads
		data = {
			action: 'pingeb_get_tag_without_markers'
		};

		jQuery.post(ajaxurl, data, function(response) {
			tagsWithoutMarkers = JSON.parse(response);			
			
			if(tagsWithoutMarkers.length > 0){
				var html = "";
				//header
				html +="<div class='pingeb-table-header'>";
				html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>internal Id</div>";
				html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>old Marker ID</div>";
				html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>Downloads</div>";
				html +="<div class='pingeb-table-header-col' style='border-right:1px solid #a4a4a4;border-left:1px solid #a4a4a4;'>&nbsp;</div>";
				html +="</div>";
				
				//tags without downloads
				for(var i = 0; i < tagsWithoutMarkers.length; i++){
					html +="<div class='pingeb-table-row'>";
					
					html +="<div class='pingeb-table-col-mm'>" + tagsWithoutMarkers[i]['id'] + "</div>";
					html +="<div class='pingeb-table-col-mm'>" + tagsWithoutMarkers[i]['marker_id'] + "</div>";
					html +="<div class='pingeb-table-col-mm'>" + tagsWithoutMarkers[i]['downloads'] + "</div>";
					
					html +="<div class='pingeb-table-col-mm'>";
					html +="<nobr>";
					html +="<select id='pingeb_tag_maintenance_new_marker_" + tagsWithoutMarkers[i]['id'] + "' size='1'>";
					html += "<option value='-1'>Select an existing tag</option>";
					for(var k = 0; k < markers.length; k++){
						html += "<option value='" + markers[k]['id'] + "'>" + markers[k]['markername'] + "</option>";
					}
					html +="</select>";
					html +="&nbsp;<input onclick='pingeb_tag_maintenance_merge_tag(" + tagsWithoutMarkers[i]['id'] + ")' type='button' value='merge tag'>";
					html +="</nobr>";
					html +="</div>";
					
					html +="<div class='pingeb-table-col-mm'>";
					html +="<input onclick='pingeb_tag_maintenance_delete_tag(" + tagsWithoutMarkers[i]['id'] + ")' type='button' value='delete tag'>";
					html +="</div>";
					
					html +="</div>";
				}
				
				//table footer
				html +="<div class='pingeb-table-header'>";
				html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
				html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
				html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
				html +="<div class='pingeb-table-header-col'>&nbsp;</div>";
				html +="</div>";
				
				list.innerHTML = html;
			} else {
				list.innerHTML = "<p style='margin:10px;'><b>Yay! There are no tags without markers!</b></p>";
			}
			
			pingeb_hide_loading();
		});
	}
}

function pingeb_tag_maintenance_merge_tag(id){
	var new_marker = document.getElementById('pingeb_tag_maintenance_new_marker_' + id).value;
	
	if(new_marker == -1){
		alert("Please select an exisiting tag to asssign this data!");
		return;
	}
	
	var answer = confirm ("Do you really want to assign this tag and all its data to this marker?")
	if (!answer){
		return;
	}
		
	pingeb_show_loading("merging tag...");	

	data = {
		action: 'pingeb_merge_tag',
		tag_id: id,
		new_marker_id: new_marker
	};

	jQuery.post(ajaxurl, data, function(response) {		
		pingeb_hide_loading();
		pingeb_show_maintenance_list();
	});
}

function pingeb_tag_maintenance_delete_tag(id){
	var answer = confirm ("Do you really want to delete this tag and loose all downloads of this tag?")
	if (!answer){
		return;
	}
		
	pingeb_show_loading("deleting tag...");	
	
	var new_marker = document.getElementById('pingeb_tag_maintenance_new_marker_' + id).value;

	data = {
		action: 'pingeb_delete_broken_tag',
		tag_id: id
	};

	jQuery.post(ajaxurl, data, function(response) {		
		pingeb_hide_loading();
		pingeb_show_maintenance_list();
	});
}
