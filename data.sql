CREATE DATABASE time2study;

use time2study;

CREATE TABLE User(
	id_user int AUTO_INCREMENT PRIMARY KEY,
	name varchar(50) NOT NULL,
	email varchar(50) UNIQUE NOT NULL,
	password varchar(20) NOT NULL
);

CREATE TABLE Task(
	id_task int AUTO_INCREMENT PRIMARY KEY,
    id_user int not null,
	title varchar(40) NOT NULL,
	qtd_pomodoros int NOT NULL,
	description varchar(400),
	finished ENUM('1', '0') DEFAULT '0',
	FOREIGN KEY(id_user) REFERENCES User(id_user)
);


