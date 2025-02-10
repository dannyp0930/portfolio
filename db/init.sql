CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

CREATE TABLE Project (
    id          VARCHAR(255) PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    intro       TEXT NOT NULL,
    organization VARCHAR(255),
    startDate   DATETIME NOT NULL,
    endDate     DATETIME,
    github      VARCHAR(255),
    homepage    VARCHAR(255),
    notion      VARCHAR(255)
);

CREATE TABLE Career (
    id          VARCHAR(255) PRIMARY KEY,
    companyName VARCHAR(255) NOT NULL,
    period      VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    position    VARCHAR(255) NOT NULL,
    duty        TEXT NOT NULL,
    content     TEXT NOT NULL
);

CREATE TABLE CareerDetail (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    careerId    VARCHAR(255) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    FOREIGN KEY (careerId) REFERENCES Career(id) ON DELETE CASCADE
);
