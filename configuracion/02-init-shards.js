// INICIALIZAMOS EL PRIMER SHARD:
//docker exec -it shard1 mongosh --port 27018

rs.initiate({
_id: "shard1ReplSet",
members: [{ _id: 0, host: "shard1:27018" }]
})

// INICIALIZAMOS EL SEGUNDO SHARD:

// docker exec -it shard2 mongosh --port 27019
rs.initiate({
_id: "shard2ReplSet",
members: [{ _id: 0, host: "shard2:27019" }]
})

// INICIALIZAMOS EL TERCER SHARD:


// docker exec -it shard2 mongosh --port 27020
rs.initiate({
_id: "shard1ReplSet",
members: [{ _id: 0, host: "shard1:27020" }]
})