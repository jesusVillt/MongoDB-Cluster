# MongoDB-Cluster

En esta actividad se implementa una base de datos distribuida sencilla en MongoDB. La arquitectura consta de un servidor de configuración, tres shards y una instancia de `mongos`.

## Integrantes
Amir Ovedi Mendiaz Rodriguez -385685
Santiago de la Mora Martínez -385613
Jesús Manuel Villegas Terrazas -385743

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
