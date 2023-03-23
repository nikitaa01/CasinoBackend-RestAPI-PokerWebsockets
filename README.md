# Póker
Manual para el server de póker
## SETUP
 - <a href="https://nodejs.org/es/download">Tener instalado Node.js</a>
 - Descargar las dependencias solo las necesarias para producción
```powershell
npm i --only=prod
```
 - Levantar el servidor
 ```powershell
node
```
- Acceder al servidor por la siguiente url:
```http
ws://localhost:3000/
```
## GENERAL
Las comunicaciones se separan en dos bloques:
 - Las opciones de menú (Conectarse, Crear lobby, Unirse a la Lobby, Empezar partida o Salir del juego)
 - Las opciones dentro del juego (CALL, CHECK, BET, RAISE, FOLD)

Las comunicaciones se hacen a través de JSONs.
Si **no** se recibe respuesta, significa que la acción **no** se ha completado.
## MENU PRINCIPAL
- **Al conectarse**: se debería de mandar el *uid* (jwt con el que ser puede identificar al usuario)
 
```json
{
	"menu": "CONNECT",
	"uid": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhvbGEifQ.q2VVCtxqE-LxNLuLVucx0t_hpxlxPDug9Z2omjVZGHw" // JWT
}
```
Un ejemplo de respuesta seria:
```json
{
	"status": "CREATED",
	"client": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhvbGEifQ.q2VVCtxqE-LxNLuLVucx0t_hpxlxPDug9Z2omjVZGHw" // El mismo JWT
}
```
- **Crear una lobby**: se debería de mandar un *status* created, tambien es necesario mandar un reward (es la cantidad de fichas que debe de pagar cada participante antes de empezar la partida y tambien son las fichas con las que empiezas a jugar)
Un ejemplo de un mensaje seria:
```json
{
	"menu": "CREATE",
	"reward": 1000 // Cantidad de fichas para poder empezar la partida de la lobbie
}
```
Un ejemplo de respuesta seria:
```json
{
	"status": "CREATED",
	"lobby": "YPUE0" // Un codigo alfanumérico en mayusculas, sirve para que otros usuarios usen el codigo para unirse a la lobby
}
```
- **Unirse a la lobby**: se deberia de mandar un *status* join, con el codigo de la lobby en el campo *gid*
Un ejemplo de un mensaje seria:
```json
{
	"status": "JOIN",
	"gid": "YPUE0" // El codigo que sirve para unirse a la lobby
}
```
Un ejemplo de respuesta seria:
```json
{
	"status": "JOINED",
	"clients": ["JWT1", "JWT2"], // Los usuarios que estan en la lobby
	"client": "JWT2" // EL usuario que se acaba de unir
}
```