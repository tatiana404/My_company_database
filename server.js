const inquirer = require("inquirer");
const mysql = require('mysql2');


const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '2219215',
    database: 'company_db'
  });


db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
  
  start();
});

function start() {
  inquirer
      .prompt({
          type: "list",
          name: "action",
          message: "Choose an action from the list:",
          choices: [
              "View all departments",
              "View all roles",
              "View all employees",
              "Add a department",
              "Add a role",
              "Add an employee",
              "Update an employee role",

          ],
      })
      .then((answer) => {
          switch (answer.action) {
              case "View all departments":
                  viewAllDepartments();
                  break;
              case "View all roles":
                  viewAllRoles();
                  break;
              case "View all employees":
                  viewAllEmployees();
                  break;
              case "Add a department":
                  addDepartment();
                  break;
              case "Add a role":
                  addRole();
                  break;
              case "Add an employee":
                  addEmployee();
                  break;
              case "Update an employee role":
                  updateEmployeeRole();
                  break;
             
          }
      });
}


function viewAllDepartments() {
  const query = "SELECT * FROM department";
  db.query(query, (err, res) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.table(res);
      
      start();
  });
}


function viewAllRoles() {
  const query = "SELECT * FROM c_role";
  db.query(query, (err, res) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.table(res);
    
      start();
  });
}


function viewAllEmployees() {
  const query = "SELECT * FROM employee";
  db.query(query, (err, res) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      console.table(res);
    
      start();
  });
}


function addDepartment() {
  inquirer
      .prompt({
          type: "input",
          name: "name",
          message: "Enter the name of the new department:",
      })
      .then((answer) => {
          console.log(answer.name);
          const query = `INSERT INTO department (name) VALUES ("${answer.name}")`;
          db.query(query, (err, res) => {
           
              console.log(`New department had been added to the database!`);
             
              start();
              console.log(answer.name);
          });
      });
}

function addRole() {
  const query = "SELECT * FROM department";
  db.query(query, (err, res) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      inquirer
          .prompt([
              {
                  type: "input",
                  name: "title",
                  message: "What role do you want to add?",
              },
              {
                  type: "input",
                  name: "salary",
                  message: "What is the salary for a new role?",
              },
              {
                  type: "list",
                  name: "department",
                  message: "Which department refers this role to?",
                  choices: res.map(
                      (department) => department.name
                  ),
              },
          ])
          .then((answers) => {
              const department = res.find(
                  (department) => department.name == answers.department
              );
              const query = "INSERT INTO c_role SET ?";
              db.query(
                  query,
                  {
                      title: answers.title,
                      salary: answers.salary,
                      department_id: department.id,
                  },
                  (err, res) => {
                    if (err) {
                        res.status(400).json({ error: err.message });
                        return;
                      }
                      console.log(
                          `The role has been added to the database!`
                      );
                     
                      start();
                  }
              );
          });
  });
}



async function addEmployee() {
    const employeeQuery = await db.promise().query ("SELECT * FROM employee")
    // console.log(employeeQuery)
    const employeeChoices = employeeQuery[0].map(
        ({id, first_name, last_name}) => ({name:`${first_name} ${last_name}`, value:id})
    )
    const query = "SELECT * FROM c_role";
    db.query(query, (err, res) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the first name of a new employee?",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the last name of a new employee?",
                },
                {
                    type: "list",
                    name: "title",
                    message: "Which role has this employee?",
                    choices: res.map(
                        ({id, title}) => ({name:title, value:id})
                    ),
                },
                {
                    type: "list",
                    name: "manager_id",
                    message: "Select the employee manager:",

                    choices: employeeChoices
                    
                },
            ])
            .then((answers) => {
              
                const sql =
                    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);";
                const values = [
                    answers.first_name,
                    answers.last_name,
                    answers.title,
                    answers.manager_id,
                ];
                db.query(sql, values, (error) => {
                    if (error) {
                        console.error(error);
                        return;
                    }

                    console.log("The new Employee added to teh database");
                    start();
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
);
}



function updateEmployeeRole() {
  const queryEmployees =
      "SELECT employee.id, employee.first_name, employee.last_name, c_role.title FROM employee LEFT JOIN c_role ON employee.role_id = c_role.id";
  const queryRoles = "SELECT * FROM c_role";
  db.query(queryEmployees, (err, resEmployees) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      db.query(queryRoles, (err, resRoles) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          inquirer
              .prompt([
                  {
                      type: "list",
                      name: "employee",
                      message: "Select the employee to update:",
                      choices: resEmployees.map(
                          (employee) =>
                              `${employee.first_name} ${employee.last_name}`
                      ),
                  },
                  {
                      type: "list",
                      name: "role",
                      message: "Select the new role:",
                      choices: resRoles.map((role) => role.title),
                  },
              ])
              .then((answers) => {
                  const employee = resEmployees.find(
                      (employee) =>
                          `${employee.first_name} ${employee.last_name}` ===
                          answers.employee
                  );
                  const role = resRoles.find(
                      (role) => role.title === answers.role
                  );
                  const query =
                      "UPDATE employee SET role_id = ? WHERE id = ?";
                      db.query(
                      query,
                      [role.id, employee.id],
                      (err, res) => {
                          if (err) throw err;
                          console.log(
                              `The role for the employee has been updated`
                          );
                        
                          start();
                      }
                  );
              });
      });
  });
}
