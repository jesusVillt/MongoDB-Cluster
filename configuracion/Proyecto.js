//CONFIGURACIÓN E IMPORTACIÓN
//(Terminal): docker cp sample_mflix.movies.json mongos:/tmp/sample_mflix.movies.json
//(Terminal): docker exec -it mongos mongoimport --port 27021 --db=sample_mflix --collection=movies --file=/tmp/sample_mflix.movies.json --jsonArray

//use sample_mflix; 

//AGREGAR ID_MOVIE Y HABILITAR SHARDING

// Inyectar id_movie secuencial a cada documento
let counter = 1;
db.movies.find().forEach(doc => {
  db.movies.updateOne({ _id: doc._id }, { $set: { id_movie: counter++ } });
});

// Habilitar particionamiento y definir Shard Key Hashed
sh.enableSharding("sample_mflix");
db.movies.createIndex({ id_movie: "hashed" });
sh.shardCollection("sample_mflix.movies", { id_movie: "hashed" });

//OPERACIONES CRUD Y MONITOREO DE BALANCEO

//CREATE: Insertar documentos de prueba
db.movies.insertMany([
  { id_movie: 999901, title: "Pelicula Prueba 1", year: 2026, genres: ["Action"] },
  { id_movie: 999902, title: "Pelicula Prueba 2", year: 2026, genres: ["Drama"] }
]);
db.movies.getShardDistribution();

//READ: Consultar por clave particionada
printjson(db.movies.findOne({ id_movie: 999901 }));
db.movies.getShardDistribution();

//UPDATE: Actualizar registro
db.movies.updateOne({ id_movie: 999901 }, { $set: { year: 2027, status: "Actualizado" } });
print("\n--- DISTRIBUCIÓN TRAS ACTUALIZAR ---");
db.movies.getShardDistribution();

//DELETE: Eliminar registro
db.movies.deleteOne({ id_movie: 999902 });
db.movies.getShardDistribution();

//ESTADO FINAL DEL CLÚSTER Y BALANCEO
sh.splitFind("sample_mflix.movies", { id_movie: 3000 });
sh.splitFind("sample_mflix.movies", { id_movie: 10000 });
sh.splitFind("sample_mflix.movies", { id_movie: 14000 });

sh.moveChunk("sample_mflix.movies", { id_movie: 3000 }, "shard1ReplSet", { waitForDelete: false });
sh.moveChunk("sample_mflix.movies", { id_movie: 14000 }, "shard3ReplSet", { waitForDelete: false });
sh.status();