CREATE DATABASE college;
use college;
create table student(
id INT primary key,
name varchar(50)
);
create table coll(
id INT primary key,
age varchar(50)
);

INSERT INTO student (id,name) VALUES
(1,'A'),(2,'B'),(3,'C'),(4,'D'),(5,'E'),(6,'F'),(7,'G'),(8,'H'),(9,'I'),(10,'J');

INSERT INTO coll (id,name) VALUES
(1,'Ab'),(2,'Bc'),(3,'Cd'),(4,'Da');

SELECT * FROM student
INNER JOIN coll ON student.id = coll.id;