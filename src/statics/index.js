const username = document.getElementById("username")
const password = document.getElementById("password")
const loginFormSubmit = document.getElementById("submit")
const loginForm = document.getElementById("form")
const container = document.getElementById("container")
const changeTimeForm = document.getElementById("changeTime")
const changeTimeSubmit = document.getElementById("changeTimeSubmit")
const timeData = document.getElementById("timeData")

const url = "https://namoz-vaqtlari-v1.herokuapp.com/api/"

let user;

let auth = ""

const timesArray = ["bomdod", "peshin", "asr", "shom", "xufton"]

changeTimeSubmit.addEventListener("click", (e) => {
	e.preventDefault()
	const times = {}
	timesArray.forEach(time => {
		const hour = document.getElementById(`${time}Hour`).value
		const minute = document.getElementById(`${time}Minute`).value
		times[time] = `${hour}:${minute}`
	})
	const body = Object.assign({auth: auth}, times)
	postData(url+"time", body).then(data => {
		if(data.success) {
			console.log(data)
			message("O`zgartirildi", true)
		} else {
			message("Xatolik: " + data.err, false)
		}

		window.scrollTo({ top: 0, behavior: 'smooth' })
	})
})


loginFormSubmit.addEventListener("click", (e) => {
	e.preventDefault()
	postData(url+"login", { username: username.value, password: password.value }).then(data => {
		if(data.success) {
			auth = data.token
			user = data.user
			loginForm.style.display = "none"
			startTimeChange()
		} else {
			if(typeof data.err == "object") data.err = "Aniqlanmagan xatolik"
			message("Xatolik: " + data.err, false)
		}

		window.scrollTo({ top: 0, behavior: 'smooth' })
	})
})

function startTimeChange(){
	changeTimeForm.style.display = "block"
	getData(url+"time").then(data => {
		if(data.success) {
			const times = {
				bomdod: data.times.bomdod,
				peshin: data.times.peshin,
				asr: data.times.asr,
				shom: data.times.shom,
				xufton: data.times.xufton
			}

			timesArray.forEach(time => {
				let [ h, m ] = times[time].split(":")
				if(Number(h) > 24) h = 24
				if(Number(h) < 0) h = 0
				if(Number(m) > 59) m = 59
				if(Number(m) < 0) m = 0
				const el = document.createElement("div")
				el.innerHTML = `<label>${capitalizeFirstLetter(time)}</label><input type="number" name="${time}" required id="${time}Hour" placeholder="soat" max="24" min="0" value="${h}"><input type="number" name="${time}" required id="${time}Minute" placeholder="daqiqa" max="59" min="0" value="${m}">`
				timeData.appendChild(el)
			})
			changeTimeSubmit.style.display = "block"
		}
	})
}

const postData = async (uri, body) => {
	const response = await fetch(uri, {
		method: "post",
		headers: {
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(body)
	})
	return response.json()
}

const getData = async (uri) => {
	const response = await fetch(uri, {
		method: "get"
	})
	return response.json()
}

function message(value, success) {
	const m = document.getElementById("message")
	m.style.display = "block"
	m.style.backgroundColor = success ? "#04AA6D" : "red"
	m.innerHTML = value
	setTimeout(() => {
		m.style.display = "none"
	}, 3000)
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

