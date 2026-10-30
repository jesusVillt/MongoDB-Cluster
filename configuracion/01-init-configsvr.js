// Para configurar los contenedores necesitamos acceder a la terminal
// de mongosh (1). Luego ejecutamos (2)

//(1) docker exec -it configsvr mongosh

rs.initiate({
_id: "configReplSet",
configsvr: true,
members: [{ _id: 0, host: "configsvr:27017" }]
})