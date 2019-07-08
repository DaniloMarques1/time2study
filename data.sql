CREATE DATABASE time2study;

use time2study;

CREATE TABLE User(
	id int AUTO_INCREMENT PRIMARY KEY,
	name varchar(50) NOT NULL,
	email varchar(50) UNIQUE NOT NULL,
	password varchar(20) NOT NULL
);


