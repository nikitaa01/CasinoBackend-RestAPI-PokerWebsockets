# Póker 

Manual para el server WebSocket de póker

## GETTING STARTED

-   ### <a href="https://nodejs.org/es/download">Tener instalado Node.js</a>
-   ### Descargar las dependencias

```powershell
npm i
```
-   ### Tener un fichero .env con los siguientes valores
```env
PORT_REST=3000
PORT_WS=3001
MONGO_URI=mongodb://localhost:27017/pixel-poker // una url de este estilo de mongo db atlas
MYSQL_URI=mysql://root@localhost:3306/nikita // una url de este estilo del xampp con la ruta de la base de datos mysql
SECRET=secret
ROOT_URI=http://localhost:3000
GOOGLE_CLIENT_ID=436131063043-0md4kovo2otm1a7cgkbfbiiqdb2bvp8s.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```
-   ### Crear los modelos de prisma
```powershell
npx prisma generate
```

-   ### Migrar la base de datos

Buscar el archivo en la ruta /prisma/migration y pegar el sql en la base de datos indicada en el archivo .env

-   ### Levantar el servidor

```powershell
npm run dev
```

Ejemplo de como se ve el servidor en ejecución:

```powershell
api rest running on port 3000
api ws running on port 3001
db connected
```

-   ### Acceder al servidor por la siguiente url:

```http
ws://localhost:3001/ws
```

## GENERAL

Las comunicaciones se separan en dos bloques:

-   ### Las opciones de menú (Conectarse, Crear lobby, Unirse a la Lobby, Empezar partida o Salir del juego)
-   ### Las opciones dentro del juego (CALL, CHECK, BET, RAISE, FOLD)

Las comunicaciones se hacen a través de JSONs.
Si **no** se recibe respuesta, significa que la acción **no** se ha completado.

## MENU PRINCIPAL

-   ### **Al conectarse**: se debería de mandar el _uid_ (iD con el que se puede identificar al usuario)

```json
{
    "menu": "CONNECT",
    "uid": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhvbGEifQ.q2VVCtxqE-LxNLuLVucx0t_hpxlxPDug9Z2omjVZGHw" // ID
}
```

Un ejemplo de respuesta seria:

```json
{
    "status": "CONNECTED",
    "client": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImhvbGEifQ.q2VVCtxqE-LxNLuLVucx0t_hpxlxPDug9Z2omjVZGHw" // El mismo ID
}
```

-   ### **Crear una lobby**: se debería de mandar un _menu_ created, tambien es necesario mandar un reward (es la cantidad de fichas que debe de pagar cada participante antes de empezar la partida y tambien son las fichas con las que empiezas a jugar)
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

-   ### **Unirse a la lobby**: se deberia de mandar un _menu_ join, con el codigo de la lobby en el campo _gid_
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "JOIN",
    "gid": "YPUE0" // El codigo que sirve para unirse a la lobby
}
```

Un ejemplo de respuesta seria:

```json
{
    "status": "JOINED",
    "clients": ["ID1", "ID2"], // Los usuarios que estan en la lobby
    "client": "ID2" // EL usuario que se acaba de unir
}
```

-   ### **Salir de la lobby** y/o salir del juego: _menu_ exit, si el usuario esta en una partida se reparte todo su balance en la mesa de la ronda actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "EXIT"
}
```

Un ejemplo de respuesta seria: (El mensjae se envia a los otros usuarios de la lobby)

```json
{
    "status": "EXITED",
    "uid": "ID1" // El usuario que se ha salido
}
```

-   ### **Empezar la partida**: _menu_ start (se cobrara el reward a cada usuario)
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "START"
}
```

Despues responderia con un _status_ started y empezaria la partida y se mandaran los mensajes correspondientes a empezar una ronda (**ver apartado de partida**)

```json
{
    "status": "STARTED"
}
```

## PARTIDA

### Resumen de la partida

La partida consta de varias rondas, cada una compuesta por cuatro stages: _preflop_, _flop_, _turn_ y _river_.

En cada _stage_, la acción continúa hasta que todos los jugadores han igualado las apuestas o han pasado. Una vez que todos los jugadores estan igualados segun las fichas en la mesa, se pasa al siguiente _stage_. Al finalizar el stage _river_, la ronda termina, se determina el ganador y se distribuyen las fichas ganadas. La información de la ronda se guarda en la base de datos.

Después de cada ronda, se espera un _menu_ start para comenzar la siguiente ronda.

### Comienzo de la ronda

Al comenzar la ronda, se envían varios mensajes con información importante, tales como:

-   Quién será el "_dealer_" (es decir, la persona a partir de la cual se eligen a los dos siguientes usuarios para realizar las _ciegas_). Después de completar la ronda, el dealer será el siguiente jugador.
-   La actual **stage** de la ronda, va a ser **preflop** pero puede ser _preflop_, _flop_, _turn_ o _river_.
-   Las _cartas personales_ de cada jugador
-   Se completan las dos _ciegas_, cuya cantidad de fichas se calculan a partir de la _reward_ de la sala de juego.
-   Finalmente, se envía un aviso al jugador que le toca jugar.

Un ejemplo de esto seria:

```json
{
    "status": "DEALER",
    "uid": "ID1"
}
```

```json
{
    "status": "NEW_STAGE",
    "_stage_": "preflop"
}
```

```json
{
    "status": "PERS_CARDS",
    "cards": [
        {
            "suit": "hearts",
            "value": "14"
        },
        {
            "suit": "hearts",
            "value": "13"
        }
    ]
}
```

### Respuestas comunes

-   #### **status waiting**: este mensaje se envia al usuario que tiene que realizar una accion de turno, la acciones posibles salen en el array _actions_.
    Un ejemplo de un mensaje seria:

```json
{
    "status": "WAITING", // solo al usuario que le toca apostar
    "actions": [
        // son las posibles acciones que puede realizar el usuario
        "CALL",
        "RAISE",
        "FOLD"
    ],
    "diference": 50, // la diferencia de fichas que tiene que pagar el usuario para igualar la apuesta
    "maxAmount": 950, // la cantidad maxima de fichas que puede apostar el usuario
    "balance": 950 // el balance del usuario
}
```

-   #### **status done_action**: este mensaje se envia despues de que un usuario haga una accion de turno
    Un ejemplo de un mensaje seria:

```json
{
    "status": "DONE_ACTION",
    "uid": "ID1", // el usuario que ha realizado la accion
    "amount": 100, // la cantidad de fichas que ha apostado el usuario
    "action": "RAISE", // la accion que ha realizado el usuario
    "balance": 900, // el balance del usuario que ha realizando la accion
    "tableAmount": 150 // la cantidad de fichas que hay en la mesa
}
```

### Acciones dentro de la partida

_Todas las respuestas son como la respuesta de **status done_action** pero cambiando los valores._

Todas las acciones que tengan que ver con la partida deben de tener un _menu_ **IN_GAME** y un _turnAction_ que puede ser:

-   #### **CHECK**: _turnAction_ check, se usa para pasar el turno sin apostar, solo se puede usar si no se ha apostado nada en la _stage_ actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "IN_GAME",
    "turnAction": "CHECK"
}
```

-   #### **CALL**: _turnAction_ call, se usa para igualar la apuesta mas alta de la _stage_ actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "IN_GAME",
    "turnAction": "CALL"
}
```

-   #### **RAISE**: _turnAction_ raise, se usa para aumentar la apuesta mas alta de la _stage_ actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "IN_GAME",
    "turnAction": "RAISE",
    "amount": 100 // la cantidad de fichas que se quiere apostar
}
```

-   #### **FOLD**: _turnAction_ fold, se usa para retirarse de la ronda actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "IN_GAME",
    "turnAction": "FOLD"
}
```

-   #### **BET**: _turnAction_ bet, se usa para apostar fichas cuando no hay apuestas en la _stage_ actual.
    Un ejemplo de un mensaje seria:

```json
{
    "menu": "IN_GAME",
    "turnAction": "BET",
    "amount": 100 // la cantidad de fichas que se quiere apostar
}
```

### Fin de la ronda

Se produce al completar la stage _river_ y se envia un mensaje con el ganador de la ronda, la cantidad de fichas que ha ganado y las combinaciones de todos los jugadores que han quedado en la ronda.
El ganador se determina por la herarquia de las combinaciones, la herarquia de las combinaciones es la siguiente:

-   Royal Flush = 0
-   Straight Flush = 1
-   Four of a Kind = 2
-   Full House = 3
-   Flush = 4
-   Straight = 5
-   Three of a Kind = 6
-   Two Pair = 7
-   One Pair = 8
-   High Card = 9

En caso de que dos jugadores tengan la misma combinacion, gana el que tenga la carta mas alta de la combinacion, en caso de que tengan la misma carta mas alta, gana el que tenga la segunda carta mas alta de la combinacion y asi sucesivamente.

Un ejemplo de respuesta seria:

```json
{
    "status": "FINISH",
    "winners": [
        // Es un array para casos de empate
        {
            "uid": "ID1", // el jugador
            "proffit": 200 // la cantidad de fichas que ha ganado cada jugador
        }
    ],
    "combinations": [
        // Las combinaciones de todos los jugadores que han quedado en la ronda
        {
            "player": "ID1", // el jugador
            "combination": {
                "combination": [
                    // la combinacion
                    {
                        "suit": "diamond",
                        "value": 9
                    },
                    {
                        "suit": "spade",
                        "value": 9
                    },
                    {
                        "suit": "club",
                        "value": 9
                    },
                    {
                        "suit": "heart",
                        "value": 12
                    },
                    {
                        "suit": "diamond",
                        "value": 12
                    }
                ],
                "highCardValues": [9, 12, 7, 3], // las cartas mas altas de la combinacion
                "herarchy": 3 // la herarquia de la combinacion
            }
        },
        {
            "player": "ID2",
            "combination": {
                "combination": [
                    {
                        "suit": "diamond",
                        "value": 9
                    },
                    {
                        "suit": "spade",
                        "value": 9
                    },
                    {
                        "suit": "club",
                        "value": 9
                    }
                ],
                "highCardValues": [9, 13, 12, 11],
                "herarchy": 6
            }
        }
    ]
}
```

### Fin de la partida

La partida finaliza, cuando todos los jugadores se han retirado de la partida o cuando solo le queda balance a un jugador, se envia un mensaje con el ganador de la partida y la cantidad de fichas que ha ganado.