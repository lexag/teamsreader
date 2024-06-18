var messages = {}
var filterObject = { search: "", tosearch: false, date: new Date(), single_day: false }

function onChange(event) {
	var reader = new FileReader();
	reader.onload = onReaderLoad;
	reader.readAsText(event.target.files[0]);
}

function onReaderLoad(event) {
	messages = JSON.parse(event.target.result);
	applyFilter()
}

function render(json) {
	$(".message-space").empty();
	var last_author = ""
	var last_date = 0
	var author_blob_div
	var time_blob_div
	for (let i = 0; i < json.length; i++) {
		let obj = json[i];
		if (!filterFunction(obj)) {
			continue;
		}

		let date = new Date(obj.time)

		if (date - last_date > 1000 * 60 * 60) {
			time_blob_div = $(".message-space").append(`<div class="time-separator">${new Date(obj.time).toLocaleString()}<div class="time-separator-line"></div></div>`);
			new_author_blob_flag = true
		}
		if (obj.author != last_author || new_author_blob_flag) {
			author_blob_div = time_blob_div.append(`<div class="author-separator"><div class="author-separator-line"></div>${obj.author.split(" ")[0]}</div>`);
			new_author_blob_flag = false
		}
		author_blob_div.append(`<p>${obj.content}</p>`);
		last_author = obj.author
		last_date = date
	}
}

function applyFilter() {
	filterObject = {
		search: $("#searchbar").val().toLowerCase(),
		tosearch: $("#searchbar").val().length > 0,
		date: new Date($("#startdate").val()),
		single_day: $("#oneday").is(":checked")
	}
	render(messages)
}

function filterFunction(obj) {
	let date = new Date(obj.time)
	let content = obj.content ?? ""
	let images = obj.images
	let author = obj.author

	// if searching for text, display entire history
	if (filterObject.tosearch) {
		if(!content.toLowerCase().includes(filterObject.search)) {
			return false;
		}
	}
	// if not searching
	else {
		// start at date
		if (date - filterObject.date < 0) {
			return false;
		}

		// if single day, range is single day, else range is 100 days
		var timerange = 86400000
		if (!filterObject.single_day) {
			timerange *= 100;
		}
		// if out of range, return false
		if (date - new Date(filterObject.date.getTime() + timerange) > 0) {
			return false;
		}
	}

	return true;
}

function nudgeDates(amount) {
	let startdate = new Date(new Date($("#startdate").val()).getTime() + amount * 86400000)
	let enddate = new Date(startdate + 2 * 86400000)
	$("#startdate").val(startdate.toISOString().split('T')[0]);
	$("#enddate").val(enddate.toISOString().split('T')[0]);
	applyFilter()
}


document.getElementById('myFile').addEventListener('change', onChange);
