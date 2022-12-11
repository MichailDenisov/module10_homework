// Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
// Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

// При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.

// Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:
// Добавить в чат механизм отправки гео-локации:

// При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку
//  на https://www.openstreetmap.org/ с вашей гео-локацией.
//  Сообщение, которое отправит обратно эхо-сервер, не выводить.

const wsUri = " wss://echo-ws-service.herokuapp.com";//Присваиваем значение эхо сервера

const input = document.querySelector('.input');//находим "инпут"
const btnMess = document.querySelector('.btn-mess');//кнопку "отправить"
const btnGeo = document.querySelector('.btn-geo');//кнопка гео-локация
const userMessages = document.querySelector('.user-messages');//чат сообщений
const serverMessages = document.querySelector('.server-messages');
const wrapperChat = document.querySelector('.wrapper-chat');

//Выводит сообщения
function writeToScreen(message, position='flex-end') {
	let element = `
        <p class='messages' style='align-self: ${position}'>
            ${message}
        </p>
    `;
	userMessages.innerHTML += element;
	wrapperChat.scrollTop = wrapperChat.scrollHeight;
  }

//Объект соединения
 let websocket = new WebSocket(wsUri); 
	websocket.onopen = function(evt) {
		console.log("CONNECTED");
	};
	websocket.onmessage = function(evt) {
		writeToScreen(`ответ сервера: ${evt.data}`, 'flex-start');
	};
	websocket.onerror = function(evt) {
		writeToScreen(`server: ${evt.data}`, 'flex-start');
	};

  //отправка сообщения
  btnMess.addEventListener('click', () => {
	let message = input.value;
	websocket.send(message);
	writeToScreen(`Вы: ${message}`);
	input.value = ''

  });
  //гео-локация.
  // Функция,  об ошибке
const error = () => {
	let textErr0r = 'Невозможно получить ваше местоположение';
	writeToScreen(textErr0r);
  };

  // Функция, срабатывающая при успешном получении геолокации
  const success = (position) => {
	let latitude  = position.coords.latitude;
	let longitude = position.coords.longitude;
	let geoLink = `https://www.openstreetmap.org/#map=18/58.01045/56.22944${latitude}/${longitude}`;
	writeToScreen(`<a  href='${geoLink}' target='_blank'>Ваша гео-локация</a>`);
  };

  btnGeo.addEventListener('click', () => {
	if (!navigator.geolocation) {
	  console.log('Geolocation не поддерживается вашим браузером');
	} else {
	  navigator.geolocation.getCurrentPosition(success, error);
	}
  });
  //удаляем сообщения
  serverMessages.addEventListener('click', () => {
	userMessages.innerHTML = " ";
  });
