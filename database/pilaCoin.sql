CREATE TABLE blockchain(
    id int NOT NULL AUTO_INCREMENT,
    cotacao DECIMAL ,
    valorPila DECIMAL ,
    valorReal DECIMAL,
    dataHora TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO blockchain(cotacao, valorPila, valorReal, dataHora)
    VALUES(
        2.0,
        1000,
        1000,
        current_timestamp
    );