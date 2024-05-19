let isVerify = false;
let users = {};

// ВАЛИДАЦИЯ ПОЛЕЙ ------------------------------------

const validateEmail = email => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
};
const validatePassword =
	/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const validatePhone = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;

// ------------------------- slider

const slidesArray = document.querySelectorAll('.slider_element');
function prevSlide() {
	for (let i = 0; i < slidesArray.length; i++) {
		if (slidesArray[i].classList.contains('active')) {
			slidesArray[i].classList.remove('active');
			slidesArray[i - 1 >= 0 ? i - 1 : slidesArray.length - 1].classList.add(
				'active'
			);
			break;
		}
	}
}
function nextSlide() {
	for (let i = 0; i < slidesArray.length; i++) {
		if (slidesArray[i].classList.contains('active')) {
			slidesArray[i].classList.remove('active');
			slidesArray[(i + 1) % slidesArray.length].classList.add('active');
			break;
		}
	}
}

// ------------------------------ scroll

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		document.querySelector(this.getAttribute('href')).scrollIntoView({
			behavior: 'smooth',
		});
	});
});
// chrome://flags/#smooth-scrolling (для работы скролла)

// ---------------------------- МОДАЛЬНЫЕ ОКНА
const checkScroll = {
	disabledScroll() {
		document.body.style.cssText = `
        overflow: hidden;
        `;
	},
	enabledScroll() {
		document.body.style.cssText = '';
	},
};

function openModal(modalSelector) {
	if (!isVerify) {
		const modalWindow = document.querySelector(modalSelector); // modal or modal2
		feedbackInEmail2.innerHTML = '';
		inputEmail.value = '';
		checkboxModal.checked = false;
		feedbackInEmail.innerHTML = '';
		modalWindow.classList.add('open');
		checkScroll.disabledScroll();
		window.addEventListener('keydown', e => {
			if (e.key === 'Escape') {
				document.querySelector(modalSelector).classList.remove('open');
				checkScroll.enabledScroll();
			}
		});
	} else {
		window.location.href = 'profile.html';
	}
}
function closeModal(modalSelector) {
	const modalWindow = document.querySelector(modalSelector);
	modalWindow.classList.remove('open');
	checkScroll.enabledScroll();
}

// -------------------------- проверка модального окна с подпиской

const checkboxModal = document.querySelector('.checkbox-in-email-modal');
const inputEmail = document.querySelector('.inputEmailToFollow');
const feedbackInEmail = document.querySelector('.feedbackInEmailModal');
function checkModalWithEmail() {
	if (!checkboxModal.checked) {
		feedbackInEmail.innerHTML = `
            <p class="errorInCheck">Необходимо согласие на обработку данных</p>
            `;
	} else if (validateEmail(inputEmail.value)) {
		inputEmail.value = '';
		feedbackInEmail.innerHTML = '';
		checkboxModal.checked = false;
		closeModal('.modal');
	} else {
		feedbackInEmail.innerHTML = `
            <p class="errorInCheck">Введите корректный почтовый адрес</p>
            `;
	}
}

// ---------------------- модальное окно регистрации

const login = document.querySelector('.inputEmailToAutorization');
const password = document.querySelector('.inputPassowrdToAutorization');
const feedbackInEmail2 = document.querySelector('.feedbackInEmailModal2');
const feedbackInEmail3 = document.querySelector('.feedbackInEmailModal3');
const profName = document.querySelector('.profile-name');
function User(login, password) {
	this.login = login;
	this.password = password;
}
function createId(users) {
	return Object.keys(users).length;
}

function clickToSignIn() {
	const loginUser = login.value;
	const passwordUser = password.value;
	if (fullValidate(login.value, password.value, feedbackInEmail2)) {
		let isUserFound = false;
		for (let userId in users) {
			if (users.hasOwnProperty(userId)) {
				if (users[userId].login === loginUser) {
					if (users[userId].password === passwordUser) {
						closeModal('.modal2');
						profName.innerHTML = `
						<a>${loginUser}</a>
						`;
						isUserFound = true;
						isVerify = true;
						break;
					}
				}
			}
		}

		if (!isUserFound) {
			feedbackInEmail2.innerHTML = `<p class='errorInCheck'>Вы ввели неверные данные</p>`;
		}
	}
}

function clickToSignUp() {
	closeModal('.modal2');
	openModal('.modal3');
}

function fullValidate(login, password, feedbackInEmail2) {
	if (
		(validateEmail(login) || validatePhone.test(login)) &&
		validatePassword.test(password)
	) {
		login = '';
		feedbackInEmail2.innerHTML = '';
		password = '';
		return true;
	} else if (!validateEmail(login) && !validatePhone.test(login)) {
		feedbackInEmail2.innerHTML = `
            <p class="errorInCheck">Введите корректный логин</p>
            `;
		return false;
	} else {
		feedbackInEmail2.innerHTML = `
            <p class="errorInCheck">Введите корректный пароль</p>
            `;
		return false;
	}
}

// ---------------------------------

function clickToFinallyRegistration() {
	const loginUser = document.querySelector(
		'.inputEmailToFinallyRegistration'
	).value;
	const passwordUser = document.querySelector(
		'.inputPassowrdToFinallyRegistration'
	).value;
	const nameUser = document.querySelector('.inputNameReg').value;
	const surnameUser = document.querySelector('.inputSurnameReg').value;
	const documUser = document.querySelector('.inputDocReg').value;
	const repPassUser = document.querySelector('.inputRepPass').value;
	const allFinallyReg = document.querySelectorAll('.fReg');

	if (checkNoEmpty(allFinallyReg)) {
		if (fullValidate(loginUser, passwordUser, feedbackInEmail3)) {
			let isLoginTaken = false;
			for (let userId in users) {
				if (users.hasOwnProperty(userId)) {
					if (users[userId].login === loginUser) {
						feedbackInEmail3.innerHTML = `
	          <p class='errorInCheck'>
	            Данный логин уже занят, попробуйте другой
	          </p>
	        `;
						isLoginTaken = true;
						break;
					}
				}
			}

			if (passwordUser == repPassUser) {
				if (!isLoginTaken) {
					const user = new User(loginUser, passwordUser);
					const userId = 'User' + createId(users);
					users[userId] = user;
					closeModal('.modal3');
					profName.innerHTML = `
						<a id="username" href="#" >${nameUser} ${surnameUser}</a>
						`;
					isVerify = true;
				}
			} else {
				feedbackInEmail3.innerHTML = `
	          <p class='errorInCheck'>
	            Пароли не совпадают
	          </p>
	        `;
			}
		}
	} else {
		feedbackInEmail3.innerHTML = `
	          <p class='errorInCheck'>
	            Заполните все поля
	          </p>
	        `;
	}
}

function checkNoEmpty(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].value == '') {
			return false;
		}
	}
	return true;
}

// ---------------------- переход

// if (document.getElementById('goToPageButton')) {
// 	document
// 		.getElementById('goToPageButton')
// 		.addEventListener('click', function () {
// 			saveUsernameAndRedirect();
// 		});
// } else {
// 	displayUsername();
// }

// function displayUsername() {
// 	let username = localStorage.getItem('username');
// 	if (username) {
// 		document.getElementById('profilenamesearchhtml').innerText =
// 			'Hello, ' + username + '!';
// 	} else {
// 		document.getElementById('profilenamesearchhtml').innerText =
// 			'Hello, guest!';
// 	}
// }

// function saveUsernameAndRedirect() {
// 	let username = document.getElementById('username').textContent;
// 	localStorage.setItem('username', username);
// 	window.location.href = 'search.html';
// }

//
// if (document.getElementById('goToPageButton')) {
// 	document
// 		.getElementById('goToPageButton')
// 		.addEventListener('click', function () {
// 			let username = document.getElementById('username').value;
// 			localStorage.setItem('username', username);
// 			window.location.href = 'search.html';
// 		});
// } else {
// 	// Код для страницы поиска
// 	let username = localStorage.getItem('username');
// 	if (username) {
// 		document.getElementById('welcomeMessage').textContent =
// 			'Привет, ' + username + '!';
// 	} else {
// 		document.getElementById('welcomeMessage').textContent = 'Добро пожаловать!';
// 	}
// }

let isValidSearch = false;
const cyrillicPattern = /^[\u0400-\u04FF]+$/;
const inputFrom = document.querySelector('.inputFrom');
const inputWhere = document.querySelector('.inputWhere');
const inputDateFrom = document.querySelector('.inputDateFrom');
const inputDateWhere = document.querySelector('.inputDateWhere');
const inputHowMany = document.querySelector('.inputHowMany');
const feedback = document.querySelector('.fbSearch');
const isDigit = /^(\d*[.,]?\d+|\d+[.,]?\d*)$/;

function chechValidSearch() {
	if (
		/[а-яА-ЯЁё]/.test(inputFrom.value) &&
		/[а-яА-ЯЁё]/.test(inputWhere.value)
	) {
		let currentDate = new Date();
		let dateNow =
			currentDate.getFullYear() +
			'-' +
			'0' +
			(currentDate.getMonth() + 1) +
			'-' +
			currentDate.getDate();
		if (dateNow < inputDateFrom.value) {
			feedback.innerHTML = '';
			console.log(dateNow);
			console.log(inputDateFrom.value);
			if (isDigit.test(inputHowMany.value)) {
				inputHowMany.value > 1 && inputHowMany.value < 9
					? (window.location.href = 'search.html')
					: (feedback.innerHTML = `
	          <p class='errorInCheck'>
	            Введите корректное количество человек (1 - 8)
	          </p>`);
			} else {
				feedback.innerHTML = `
	          <p class='errorInCheck'>
	            Введите корректное количество человек (1 - 8)
	          </p>`;
			}
		} else {
			feedback.innerHTML = `
	          <p class='errorInCheck'>
	            Выберите день позже сегодняшнего
	          </p>`;
		}
	} else {
		feedback.innerHTML = `
	          <p class='errorInCheck'>
	            Введите верно названия городов
	          </p>`;
	}
}

if (document.getElementById('goToPageButton')) {
	document
		.getElementById('goToPageButton')
		.addEventListener('click', function () {
			chechValidSearch();
		});
}

if (document.querySelectorAll('.booking-button')) {
	document.querySelectorAll('.booking-button').forEach(bookBtn => {
		bookBtn.addEventListener('click', function () {
			openModal('.modal2');
		});
	});
}

function returnToMainPage() {
	window.location.href = 'index.html';
}
