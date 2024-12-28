import express from 'express';
import cors from 'cors';
import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename: "SQLEXPRESS",
    },
    port: Number(process.env.DB_PORT)
}


app.get('/', (req, res) => {
    return res.json("Hello, this is the backend.");
})

// GET endpoint to fetch material data
app.get('/Materials', async(req, res) => {
    try {
        const pool = await sql.connect(config);
        const data = await pool.request().query('SELECT * from Materials');

        return res.json(data.recordset);
    }
    catch(err) {
        console.log(err);
    }
})

// POST endpoint to add a new material
app.post('/Materials', async (req, res) => {
    try {
        const newData = req.body;

        if (!newData || Object.keys(newData).length === 0) {
            return res.status(400).json({ error: "No data provided to insert." });
        }

        const columns = Object.keys(newData);
        const values = Object.values(newData);
        const columnNames = columns.join(', ');
        const valuePlaceholders = columns.map((_, index) => `@value${index}`).join(', ');

        const query = `
            INSERT INTO Materials (${columnNames})
            OUTPUT INSERTED.*   -- This will return the inserted row
            VALUES (${valuePlaceholders});
        `;

        const pool = await sql.connect(config);
        const request = pool.request();

        columns.forEach((col, index) => {
            request.input(`value${index}`, values[index]);
        });

        const result = await request.query(query);

        // Send the inserted row (with correct data) back to the frontend
        return res.status(201).json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding material.");
    }
});

// PUT endpoint to update a material by ID
app.put('/Materials/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        if (!id || !updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ error: "Invalid request data." });
        }

        // Exclude the 'Id' column from being updated
        const columns = Object.keys(updatedData).filter((col) => col !== 'Id');
        
        if (columns.length === 0) {
            return res.status(400).json({ error: "No updatable fields provided." });
        }

        // Dynamically create the SET clause for the query
        const setClause = columns.map((col, index) => `${col} = @value${index}`).join(', ');

        // Construct the SQL query
        const query = `
            UPDATE Materials
            SET ${setClause}
            WHERE Id = @id;
        `;

        const pool = await sql.connect(config);
        const request = pool.request();

        // Bind the dynamic values to their placeholders
        columns.forEach((col, index) => {
            request.input(`value${index}`, updatedData[col]); // Ensure correct column-value mapping
        });

        // Bind the Id parameter
        request.input('id', sql.Int, parseInt(id, 10));

        const result = await request.query(query);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Material not found." });
        }

        return res.status(200).json({ message: "Material updated successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error updating material." });
    }
});

// DELETE endpoint to delete a material by ID
app.delete('/Materials/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "No ID provided." });
        }

        const pool = await sql.connect(config);
        const result = await pool
            .request()
            .input('id', sql.Int, parseInt(id, 10))
            .query('DELETE FROM Materials WHERE Id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Material not found." });
        }

        return res.status(200).json({ message: "Material deleted successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Error deleting material." });
    }
});

app.listen(3000, () => {
    console.log("The server has started.");
})