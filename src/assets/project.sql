

CREATE TABLE IF NOT EXISTS transction(
   transaction_id integer primary key AUTOINCREMENT not null,
   account_no integer not null,
   credit boolean not null,
   date_time datatype text not null,
   amount real not null,
   --primary key (transaction_id),
   foreign key(account_no) references account(account_no) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS account(
  type_id text NOT NULL,
  account_no integer not null,
  balance real NOT NULL ,
  opening_date text NOT NULL,
  agent_id text NOT NULL,
  password text NOT NULL, 
  PRIMARY KEY  (account_no),
  FOREIGN KEY (type_id) REFERENCES account_type_info (type_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE IF NOT EXISTS account_type_info ( 
  type_id text NOT NULL,
  type_name text NOT NULL,
  interest_rate real NOT NULL,
  minimum_balance real NOT NULL,
  min_age integer NOT NULL,
  max_age integer NOT NULL,
  PRIMARY KEY (type_id)
  );
  
  CREATE TABLE IF NOT EXISTS owner_info (
  customer_id text NOT NULL,
  account_no integer NOT NULL , 
  password text NOT NULL,
  PRIMARY KEY  (account_no),
  FOREIGN KEY (account_no) REFERENCES account (account_no) ON DELETE CASCADE ON UPDATE NO ACTION
);

INSERT INTO account_type_info VALUES ('ch@123','children',12,0,0,12),('te@123','teen',11,500,13,18),('ad@123','adults',10,1000,19,60),('se@123','senior',13,1000,61,150),('jo@123','joint',7,5000,0,150);
INSERT INTO account VALUES ('ch@123',222,1203.56,'2006-02-14 22:04:36','agent1','1234'),('te@123',23365280016,234657.00,'2007-04-14 6:04:36','agent1','ty74537jdg83'),('ch@123',56365289116,3456.24,'2016-02-14 22:04:36','agent2','hp774537jdg83'),('ad@123',78365289116,1203.56,'2009-02-14 12:04:36','agent3','iu874537jdg83'),('se@123',1035289116,45997.24,'2016-02-14 22:04:36','agent2','vrt74537jdg83'),('ad@123',40365289116,3456.56,'2014-02-14 03:04:11','agent4','gbv74537jdg83');
INSERT INTO owner_info VALUES ('cust1',222, '1234'),('cust2',23365280016, '1234'),('cust3',56365289116, '1234'),('cust4',78365289116, '1234'),('cust5',1035289116, '1234');
INSERT INTO transction VALUES (001,78365289116,0,'2018-02-15 04:34:33',1000),(002,1035289116,1,'2005-02-15 04:34:33',3876),(003,40365289116,0,'2007-02-15 04:34:33',9600);
/*

select * from account;
select * from transction;
select * from account_type_info;
select * from owner_info; */