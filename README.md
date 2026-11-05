# MongoDB-Cluster

En esta actividad se implementa una base de datos distribuida sencilla en MongoDB. La arquitectura consta de un servidor de configuración, tres shards y una instancia de `mongos`.

## Integrantes
* Amir Ovedi Mendiaz Rodriguez -385685
* Santiago de la Mora Martínez -385613
* Jesús Manuel Villegas Terrazas -385743

## Configuración paso a paso

### Paso 1: Levantar los contenedores

En la carpeta de configuración encontrará todo lo necesario para implementar esta base de datos distribuida. Ejecute:

```bash
docker compose up
```

Esto levantará el servidor de configuración, la instancia de `mongos` y los tres shards necesarios para esta actividad.

### Paso 2: Inicializar los Replica Set

#### 2.1 Servidor de configuración

```bash
docker exec -it configsvr mongosh --port 27017
```

```javascript
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "configsvr:27017" }]
})
```

#### 2.2 Primer shard

```bash
docker exec -it shard1 mongosh --port 27018
```

```javascript
rs.initiate({
  _id: "shard1ReplSet",
  members: [{ _id: 0, host: "shard1:27018" }]
})
```

#### 2.3 Segundo shard

```bash
docker exec -it shard2 mongosh --port 27019
```

```javascript
rs.initiate({
  _id: "shard2ReplSet",
  members: [{ _id: 0, host: "shard2:27019" }]
})
```

#### 2.4 Tercer shard

```bash
docker exec -it shard3 mongosh --port 27020
```

```javascript
rs.initiate({
  _id: "shard3ReplSet",
  members: [{ _id: 0, host: "shard3:27020" }]
})
```

### Paso 3: Conectarse a mongos

```bash
docker exec -it mongos mongosh --port 27021
```

### Paso 4: Agregar los shards al cluster

```javascript
sh.addShard("shard1ReplSet/shard1:27018")
sh.addShard("shard2ReplSet/shard2:27019")
sh.addShard("shard3ReplSet/shard3:27020")
```

Podemos confirmar que se hayan agregado con:

```javascript
sh.status()
```

### Paso 5: Habilitar el particionamiento en la base de datos

```javascript
sh.enableSharding("dbemp")
```

### Paso 6: Crear el índice y definir la clave de fragmentación

```javascript
use dbemp

db.emp.createIndex({ empno: "hashed" })
```

Indicamos la clave de fragmentación:

```javascript
sh.shardCollection("dbemp.emp", { empno: "hashed" })
```

### Paso 7: Insertar los datos de prueba

```javascript
db.emp.insertMany([
  { empno: 7369, ename: "SMITH",  job: "CLERK",     sal: 800.0,  dept: { deptno: 20, dname: "RESEARCH",   loc: "DALLAS"   } },
  { empno: 7499, ename: "ALLEN",  job: "SALESMAN",  sal: 1600.0, dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7521, ename: "WARD",   job: "SALESMAN",  sal: 1250.0, dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7566, ename: "JONES",  job: "MANAGER",   sal: 2975.0, dept: { deptno: 20, dname: "RESEARCH",   loc: "DALLAS"   } },
  { empno: 7654, ename: "MARTIN", job: "SALESMAN",  sal: 1250.0, dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7698, ename: "BLAKE",  job: "MANAGER",   sal: 2850.0, dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7782, ename: "CLARK",  job: "MANAGER",   sal: 2450.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } },
  { empno: 7788, ename: "SCOTT",  job: "ANALYST",   sal: 3000.0, dept: { deptno: 20, dname: "RESEARCH",   loc: "DALLAS"   } },
  { empno: 7839, ename: "KING",   job: "PRESIDENT", sal: 5000.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } },
  { empno: 7844, ename: "TURNER", job: "SALESMAN",  sal: 1500.0, dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7876, ename: "ADAMS",  job: "CLERK",     sal: 1100.0, dept: { deptno: 20, dname: "RESEARCH",   loc: "DALLAS"   } },
  { empno: 7900, ename: "JAMES",  job: "CLERK",     sal: 950.0,  dept: { deptno: 30, dname: "SALES",      loc: "CHICAGO"  } },
  { empno: 7902, ename: "FORD",   job: "ANALYST",   sal: 3000.0, dept: { deptno: 20, dname: "RESEARCH",   loc: "DALLAS"   } },
  { empno: 7934, ename: "MILLER", job: "CLERK",     sal: 1300.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } }
])
```

### Paso 8: Verificar la distribución de los datos

Para comprobar que los documentos se repartieron entre los shards:

```javascript
db.emp.getShardDistribution()
```

# MongoDB-Cluster Proyecto

### Paso 1: 
seguir todos los pasos hasta el paso 5 anterior

### Paso 2: Copiar e importar la base de datos de prueba
Copiamos el archivo con la semilla `sample_mflix.movies.json` al contenedor de `mongos`:

```bash

docker cp sample_mflix.movies.json mongos:/tmp/sample_mflix.movies.json

```

Importamos los datos de prueba a la colección `movies`:

```bash
docker exec -it mongos mongoimport --port 27021 --db=sample_mflix --collection=movies --file=/tmp/sample_mflix.movies.json --jsonArray

```

### Paso 3: Conectarse a la base de datos e indexar

```bash
docker exec -it mongos mongosh --port 27021

```

nos aseguramos de estar sobre la base de datos sample-mflix:
```javascript
use sample_mflix
```
Asignamos el id_movie a cada documento

```javascript
let counter = 1;

db.movies.find().forEach(function(doc) {

    db.movies.updateOne(

        { _id: doc._id },

        { $set: { id_movie: counter++ } }

    );

});
```

### Paso 4: Respaldar la colección original

```javascript

db.movies.aggregate([{ $out: "movies_backup2" }])

```
Verificamos que la copia contenga la totalidad de los documentos:
```javascript

db.movies_backup2.countDocuments()

```

### Paso 5: Vaciar la colección principal

Eliminamos la colección `movies`

```javascript

db.movies.drop()

```

### Paso 6: Configurar la clave de fragmentación (Shard Key Hashed)

Configuramos la Shard Key de tipo `hashed` sobre el campo `id_movie`.
```javascript

sh.shardCollection("sample_mflix.movies", { id_movie: "hashed" }, false, { numInitialChunks: 6 })

```

### Paso 7: Restaurar los datos
Reinsertamos los datos desde la copia de respaldo:

```javascript
let batch = [];

db.movies_backup2.find().forEach(function(d) {

    batch.push(d);

    if (batch.length == 1000) { 

        db.movies.insertMany(batch); 

        batch = []; 

    }

});

if (batch.length) db.movies.insertMany(batch);

```

### Paso 8: Verificar la distribución

```javascript

db.movies.getShardDistribution()

```




