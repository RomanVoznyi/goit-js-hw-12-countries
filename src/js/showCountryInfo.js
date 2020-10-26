import country from "../templates/country.hbs";
import fetchCountries from "./fetchCountries.js";
import _ from "lodash";
import { info, error } from '@pnotify/core';
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";


const refs = {
	input: document.querySelector(".js-request"),
	output: document.querySelector(".js-response"),
}
let listOfLinks = null;

refs.input.addEventListener("input", _.debounce(makeRequest, 500));

function makeRequest() {
	refs.output.innerHTML = "";
	if (refs.input.value !== "") {
		fetchCountries(refs.input.value).then(data => {
			if (!data) {
				info({ text: "Нічого не знайшли за вашим запитом. Спробуйте ще." });
			} else parseData(data);
		})
	};
}

function parseData(data) {
	if (data.length > 10) {
		const myError = error({
			text: "Занадто багато варіантів країн. Спробуйте конкретизувати."
		});
	} else if (data.length > 1) {
		refs.output.insertAdjacentHTML("afterbegin", `<ul class="simple-list">${data.reduce((acc, { name }) => acc + `<li><a href="#">${name}</a></li>`, "")}</ul>`);
		listOfLinks = document.querySelector(".simple-list");
		listOfLinks.addEventListener("click", createRequest);
	} else {
		const page = country(data[0]);
		refs.output.insertAdjacentHTML("afterbegin", page);
	}
}

function createRequest(event) {
	refs.input.value = event.target.innerText;
	makeRequest();
	listOfLinks.removeEventListener("click", createRequest);
}
