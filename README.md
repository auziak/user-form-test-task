## How to run

1. Download repository
2. npm install
3. npm run client-install
4. npm run dev

## Description

Реализовать страницу авторизации
Использовать: NodeJS, MongoDB, Передача данных частично на сокетах, частично rest
запросы, фронт на выбор – react, angular
Дизайн согласно material desing

1. При вводе логина и пароля, которого нет в базе, кнопка добавить и войти активные, при
   попытке войти и отсутствии логина в базе, выводит ошибку (дизайн брать
   https://material.io/components/text-fields/#outlined-text-field,
   https://material.io/components/buttons/#hierarchy-placement). Кнопки и поля ввода строго
   соответствуют material design. Проверка введенных в поля данных осуществляется при
   бездействии пользователя 3 секунды и наличии символов в полях логина и пароля,
   например, пользователь ввел логин, затем пароль и 3 секунды ничего не вводит, тогда
   происходит запрос.
2. При вводе логина и пароля, который есть в базе, становятся активными кнопка войти и
   удалить
3. Активная кнопка удалить, удаляет логин и пароль с базы, очищают поля ввода и убирают
   фокус с них
4. Нет возможности добавить логин с паролем, где пароль состоит только из цифр, выводить
   ошибку

## Problems

- Password not encrypted yet
- Requests for certain users sends to "/" instead of "/:email"
- Material UI Grid not finished
- Icons not finished
- Form helper text not hidden it's just empty
