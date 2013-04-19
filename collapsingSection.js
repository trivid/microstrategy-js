var CollapsingSection = (function(){
	var arrowClassSelector = "";
	var expendedClassName = "";
	var animationSpeed = "";
	
	function findImmediateArrowChildren(arrow){
		var arrowID = arrow.attr("id");
		return $(arrowClassSelector+"[parent='"+arrowID+"']");
	}

	function findImmediateMstrDocSectionChildren(arrow) {
		var parentDocDiv = arrow.parents(".mstrDocSection");
		var pbes = parentDocDiv.attr("pbes");
		var all_children = findMstrDocSectionChildren(arrow);
		var has_arrow = all_children.has(arrowClassSelector);
		if (has_arrow.length > 0){
			return has_arrow.filter(function(i){
				var a_level = $(this).find(arrowClassSelector).attr("level");
				return a_level && parseInt(a_level) <= parseInt(arrow.attr("level"))+1;
			});
		}else{
			return all_children;
		}	
	}

	function findMstrDocSectionChildren(arrow) {
		var pbes = arrow.parents(".mstrDocSection").attr("pbes");
		return $("div.mstrDocSection[pbes*='"+pbes+"']").not(arrow.parents(".mstrDocSection"));
	}


	function assignLevelsAndId(arrows){
		return arrows.each(function(i,e){
			var parentDiv = $(e).parents(".mstrDocSection");
			var pbes = parentDiv.attr("pbes");
			var level = pbes? parseInt(pbes.split(",").length) : 0;
			if (level != 0){
				var id = pbes.split(",")[level-1];
				e.setAttribute("id",id);
			}
			e.setAttribute("level", level);
			
		});
		
	}

	function assignParents(arrows){
		return arrows.each(function(i,e){
			var parentLevel = parseInt($(e).attr("level"))-1;
			if (parentLevel > 0){
				var potentialParents = $(arrowClassSelector+"[level='"+parentLevel+"']");
				var cpbes = $(e).parents(".mstrDocSection").attr("pbes");
				var singleParent = potentialParents.filter(function(i){
					var pbes = $(this).parents(".mstrDocSection").attr("pbes");
					console.log("pbes:"+pbes+" cpbes:"+cpbes+" parentID:"+$(this).attr("id"));
					return cpbes && cpbes.indexOf(pbes) != -1
				});
				if (singleParent.length == 1){
					$(e).attr("parent", singleParent.eq(0).attr("id"));
				}else{
					console.log(singleParent.length+" parents found for element: "+e.getAttribute("id")+". Debug code");
				}
			}
		});
	}
	/*
	 Takes in a jQueary object of the class "expend_arrow",
	 and based on whether it has class expendedClassName, update the whole
	 tree of the arrows.
	*/
	function updateExpension(arrow){
		var toExpend = arrow.hasClass(expendedClassName);
		if(toExpend){
			findImmediateMstrDocSectionChildren(arrow).slideDown();
			findImmediateArrowChildren(arrow).each(function(i,e){
				updateExpension($(e));
			});
			
		}else{
			findMstrDocSectionChildren(arrow).slideUp();
		}

	}
	return {
		init: function(acName, ecName, as){
				arrowClassSelector = "." + (acName || "expend_arrow");
				expendedClassName = (expendedClassName || "expended");
				animationSpeed = as || "0.2s"
				var arrows = $(arrowClassSelector);
				arrows.on("click", function () {
					$(this).toggleClass(expendedClassName);
					updateExpension($(this));
				});
				assignLevelsAndId(arrows);
				assignParents(arrows);
				arrows.filter("[level='1']").each(function(i,e){
					updateExpension($(e));
				});
			}
}
	};
());