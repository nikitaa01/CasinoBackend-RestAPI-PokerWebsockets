# Flow lobbies poker
## Union
Para iniciar la conexion se debe de mandar un json con el atributo "status" en "CREATE" o "JOIN"
### Ejemplo con "status create"
Se deberia de mandar un JSON con esta estructura:
``` JSON
{
    "status": "CREATE"
}
```
El "status create" devolvera:
``` JSON
{
    "status": "CREATED",
    "msg": {
        "gid": "XXXXX" // string alfanumerico en mayusculas de 5 digitos
    }
}
```
El "gid" es el codigo que servira para unirse al lobby
### Ejemplo con "status join"
Se deberia de mandar un JSON con esta estructura:
``` JSON
{
    "status": "JOIN",
    "gid": "XXXXX" // string alfanumerico en mayusculas de 5 digitos
}
```
El gid es el codigo del lobby al que se va unir el cliente
El "status create" devolvera:
``` JSON
{
    "status": "CREATED",
    "msg": {
        "clients": [ // Array de identificadores de usuarios
            "eyJzdWIiOiIxIiwibmFtZSI6IjUiLCJpYXQiOjR9",
            "eyJzdWIiOiIxNCIsIm5hbWUiOiI1IiwiaWF0Ijo0fQ",
            "eyJzdWIiOiIxNCIsIm5hbUVlIjoiNSIsImlhdCI6NH0"
        ],
        "client": "eyJzdWIiOiIxNCIsIm5hbUVlIjoiNSIsImlhdCI6NH0"
    }
}
```
clients son todos los usuarios que estan en la lobby
y client es el ultimo usuario que se ha unido
## Conexion
Pero antes de hacer una de estas dos operaciones iniciales se debe de mandar otro json con el token guardado en locale storage que servira de 