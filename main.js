(function(){
	
	function onChange(event) {
		var reader = new FileReader();
		reader.onload = onReaderLoad;
		reader.readAsText(event.target.files[0]);
	}

	function onReaderLoad(event){
		var result = JSON.parse(event.target.result);
		render(result);
	}
	
	function render(json){
		var last_author = ""
		var last_date = 0
		var author_blob_div
		var time_blob_div
		for(let i = 0; i < json.length; i++) {
			let obj = json[i];
			let date = new Date(obj.time)

			if (date - last_date > 1000*60*60) {
				time_blob_div = $("body").append(`<div class="time-separator">${new Date(obj.time).toLocaleString()}<div class="time-separator-line"></div></div>`);
				new_author_blob_flag = true
			}
			if (obj.author != last_author || new_author_blob_flag) {
				author_blob_div = time_blob_div.append(`<div class="author-separator"><div class="author-separator-line"></div>${obj.author}</div>`);
				new_author_blob_flag = false
			}
			author_blob_div.append(`<p>${obj.content}</p>`);
			last_author = obj.author
			last_date = date
			console.log(obj)
		}
	}
 
	document.getElementById('myFile').addEventListener('change', onChange);

}());