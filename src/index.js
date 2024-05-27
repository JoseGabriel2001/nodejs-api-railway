import express from "express";
import { conection } from "./conection.js";
import { DB_PORT } from "./config.js";

const app = express();
app.use(express.json());

app.get("/ping", async (req, res) => {
    const result = await conection.query("select 1+1 as result");
    res.json(result[0][0]);
});

app.get("/employees", async (req, res) => {
    // Obtiendo todos los empleados
    try {
        const [result] = await conection.query("select * from employee");
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Something was wrong " });
    }
});

app.get("/employees/:id", async (req, res) => {
    // Obtiendo todos los empleados
    try {
        const [result] = await conection.query(
            "select * from employee where id= ?",
            [req.params.id]
        );

        if (result.length <= 0)
            return res.status(404).json({
                message: "Employees do not exist",
            });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.post("/employees", async (req, res) => {
    try {
        const { name, salary } = req.body;
        const [result] = await conection.query(
            "insert into employee (name, salary) values (?, ?);",
            [name, salary]
        );
        res.send({
            id: result.insetId,
            name: name,
            salary: salary,
        });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.delete("/employees/:id", async (req, res) => {
    // Obtiendo todos los empleados
    try {
        const [result] = await conection.query("delete from employee where id= ?", [
            req.params.id,
        ]);

        if (result.affectedRows === 0)
            return res.status(404).json({
                message: "Employee do not exist",
            });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.patch("/employees/:id", async (req, res) => {
    const { id } = req.params;
    const { name, salary } = req.body;

    try {
        // console.log(id, name, salary);

        const [result] = await conection.query(
            "UPDATE employee SET name =IFNULL(?, name), salary = IFNULL(?, salary) WHERE id = ?",
            [name, salary, id]
        );

        console.log(result);

        if (result.affectedRows === 0)
            return res.send(404).json({
                message: "Employee does not exist",
            });

        const [employee] = await conection.query(
            "select * from employee where id = ?",
            id
        );

        res.json(employee[0]);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});


app.use((req, res, next) => {
    res.status(404).json(
        { message: "Endpoint not found" }
    );
});
app.listen(DB_PORT);
console.log("Connect to port 3000");
