// Primero nos debemos de conectar a mongos

// docker exec -it mongos mongosh --port 27021

// Agregamos los shards al Clusert

sh.addShard("shard1ReplSet/shard1:27018")
sh.addShard("shard2ReplSet/shard2:27019")

// Podemos confirmar que se hayan agregado con:
sh.status()

// Creamos la base de datos y habilitamos el particionamiento
sh.enableSharding("dbemp")

// use dbemp
db.emp.createIndex({ empno: "hashed" })

// indicamos la clave de fragmentación
sh.shardCollection("dbemp.emp", { empno: "hashed" })

db.emp.insertMany([
  { empno: 7369, ename: "SMITH", job: "CLERK", sal: 800.0, dept: { deptno: 20, dname: "RESEARCH", loc: "DALLAS" } },
  { empno: 7499, ename: "ALLEN", job: "SALESMAN", sal: 1600.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7521, ename: "WARD", job: "SALESMAN", sal: 1250.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7566, ename: "JONES", job: "MANAGER", sal: 2975.0, dept: { deptno: 20, dname: "RESEARCH", loc: "DALLAS" } },
  { empno: 7654, ename: "MARTIN", job: "SALESMAN", sal: 1250.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7698, ename: "BLAKE", job: "MANAGER", sal: 2850.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7782, ename: "CLARK", job: "MANAGER", sal: 2450.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } },
  { empno: 7788, ename: "SCOTT", job: "ANALYST", sal: 3000.0, dept: { deptno: 20, dname: "RESEARCH", loc: "DALLAS" } },
  { empno: 7839, ename: "KING", job: "PRESIDENT", sal: 5000.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } },
  { empno: 7844, ename: "TURNER", job: "SALESMAN", sal: 1500.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7876, ename: "ADAMS", job: "CLERK", sal: 1100.0, dept: { deptno: 20, dname: "RESEARCH", loc: "DALLAS" } },
  { empno: 7900, ename: "JAMES", job: "CLERK", sal: 950.0, dept: { deptno: 30, dname: "SALES", loc: "CHICAGO" } },
  { empno: 7902, ename: "FORD", job: "ANALYST", sal: 3000.0, dept: { deptno: 20, dname: "RESEARCH", loc: "DALLAS" } },
  { empno: 7934, ename: "MILLER", job: "CLERK", sal: 1300.0, dept: { deptno: 10, dname: "ACCOUNTING", loc: "NEW YORK" } }
])