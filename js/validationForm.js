// // валидация
// (function () {
//   const form = document.querySelector("#order-form");
//   const send = document.querySelector(".form__submit");

//   const phone = document.querySelector("#phone-num");

//   phone.addEventListener("keydown", (e) => {
//     try {
//       let isDigit = false;
//       let isPlus = false;
//       let isDash = false;
//       let isAction = false;

//       if (e.key >= 0 || e.key <= 9) {
//         isDigit = true;
//       }

//       if (e.key == '+') {
//         isPlus = true;
//       }

//       if (e.key == '-') {
//         isDash = true;
//       }

//       if (e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.key == 'Backspace' || e.key == 'Delete') {
//         isAction = true;
//       }

//       if (!isDigit && !isPlus && !isDash && !isAction) {
//         throw new Error('Введите цифры');
//       }
//       e.target.nextElementSibling.textContent = '';
//     } catch (error) {
//       e.preventDefault();
//       e.target.nextElementSibling.textContent = error.message;
//     }

//   });

//   send.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (validateForm(form)) {
//       const data = {
//         name: form.elements.name.value,
//         phone: form.elements.phone.value,
//         comment: form.elements.comment.value,
//       };

//     } else {
//       console.log('Не отправляем на сервер, потому что ошибка');
//     }
//   });

//   function validateForm(form) {
//     let valid = true;

//     if (!validate(form.elements.name)) {
//       valid = false;
//     }
//     if (!validate(form.elements.phone)) {
//       valid = false;
//     }
//     if (!validate(form.elements.comment)) {
//       valid = false;
//     }
//     return valid;
//   }

//   function validate(element) {
//     if (!element.checkValidity()) {
//       element.nextElementSibling.textContent = element.validationMessage;
//       element.style.border = "1 px solid red";
//       return false;
//     } else {
//       element.nextElementSibling.textContent = "";
//       element.style.border = "none";
//       return true;
//     }
//   }
// })();