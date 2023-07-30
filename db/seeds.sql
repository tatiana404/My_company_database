INSERT INTO department (name)
VALUES ("Finance"),
       ("Supply"),
       ("Customer Support");

INSERT INTO c_role (title, salary, department_id)
VALUES ("Accounting", 6000, 1),
       ("Development", 6000, 1),
       ("Investments", 6000, 1),
       ("Billable", 4500, 2),
       ("Non-billable", 4500, 2),
       ("Tech Suppurt", 4500, 3),
       ("Onsite Support", 7000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id )
VALUES ("Zoya", "Groom", 1, 1),
       ("Brendon", "Spencer", 2, 3),
       ("Christa", "klimm", 1, 1),
       ("Jeff", "Ferry", 2, 2),
       ("TOM", "Hanks", 3, 4),
       ("Phillip", "Tomato", 1, 5),
       ("Stacey", "Linn", 1, 2);
       


       