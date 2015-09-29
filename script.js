$("textarea").click(function(){
	this.value ="";
});
$("#prev").click(function(){
	$infoPrev = "<tr style='background-color: #777;'>";
	$(".current").each(function(){
		$infoPrev += "<td>"+this.value+"</td>";
	});
	$infoPrev += "</tr>";
	$("tr:last").before($infoPrev);
	$(".current").attr("disabled", "disabled");
	$("#prev")
});


