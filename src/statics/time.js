const timeName = document.getElementById("timeName")
const timeValue = document.getElementById("timeValue")

const bomdod = document.getElementById("bomdod")
const peshin = document.getElementById("peshin")
const asr = document.getElementById("asr")
const shom = document.getElementById("shom")
const xufton = document.getElementById("xufton")


const url = "https://namoz-vaqtlari-v1.herokuapp.com/api/"

const getData = async (uri) => {
	const response = await fetch(uri, {
		method: "get"
	})
	return response.json()
}

getData(url+"time").then(data => {
	if(data.success) {
		const times = data.times
		bomdod.innerHTML = times.bomdod
		peshin.innerHTML = times.peshin
		asr.innerHTML = times.asr
		shom.innerHTML = times.shom
		xufton.innerHTML = times.xufton
	}
})

