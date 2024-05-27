create table employee (
    id int auto_increment not null,
    name varchar(255) default NULL,
    salary decimal(10,2) default NULL,
    primary key (id)
);


insert into employee (name, salary) values ("?, ?");