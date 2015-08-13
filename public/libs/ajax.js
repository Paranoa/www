define(function() {
	
	function Ajax(method, url, fnSucc, fnFail, oLoad) {
		var xmlHttp =  new XMLHttpRequest(), timer = null
		
		xmlHttp.open(method, decodeURI(url))
		
		if(typeof oLoad != "undefined") {
			oLoad.show()
		}
		
		xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencodedcharset=UTF-8")

		xmlHttp.send()
		
		timer = setTimeout(function() {
			xmlHttp.abort()
			hx.annotate("请求超时")
		}, 3000000)
		
		xmlHttp.onreadystatechange = function() {
			if(xmlHttp.readyState == 4) {
				if(xmlHttp.status == 200) {
					clearTimeout(timer)
					if(typeof oLoad != "undefined") {
						oLoad.hide()
					}

					fnSucc(xmlHttp.responseText)
				} else {
					if(fnFail) {
						fnFail(xmlHttp.status)
					}
				}
			}
		}
	}
	
	return Ajax
	
})