require.config({
	baseUrl: "../public/libs",
	paths: {
		jquery: "jquery",
		ajax: "ajax"
	}
})

define(["jquery", "ajax"], function($, ajax) {

	var aLi = $("#sect1 li"), i = 0, aHeight = {L: [], C: [], R: []}

	for(i=0; i<aLi.length; i++) {
		var iNow = i % 2

		switch(iNow) {
			case 0:
				aLi[i].style.left = "3%"
				aHeight.L.push(aLi[i].offsetHeight)

				var step = Math.floor(i / 2)

				if(!step) {
					aLi[i].style.top = 0
				} else {
					var sum = 0
					for(var j=0; j<step; j++) {
						sum += aHeight.L[j] + 5
					}
					aLi[i].style.top = sum + "px"
				}

				break
			case 1:
				aLi[i].style.left = "52%"
				aHeight.C.push(aLi[i].offsetHeight)

				var step = Math.floor(i / 2)

				if(!step) {
					aLi[i].style.top = 0
				} else {
					var sum = 0
					for(var j=0; j<step; j++) {
						sum += aHeight.C[j] + 5
					}
					aLi[i].style.top = sum + "px"
				}

				break
		}
	}

})