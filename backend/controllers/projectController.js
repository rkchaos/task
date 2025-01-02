
const sqlDatabase = require("../databse");

exports.project = async (req, res) => {
    try {
        const {
            project_name,
            owner_id,
            manager_id,
            start_date,
            end_date,
            comp_date,
            delivery_date,
            project_progress,
            time_elapsed,
        } = req.body;

        const query = `
            INSERT INTO project 
            (project_name, owner_id, manager_id, start_date, end_date, comp_date, delivery_date, project_pregress, time_elapsed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

       sqlDatabase.query(
            query,
            [
                project_name,
                owner_id,
                manager_id || null,
                start_date,
                end_date,
                comp_date || null,
                delivery_date || null,
                project_progress || 0,
                time_elapsed || 0,
            ],
            (err, result,field) => {
                if (err) {
                    console.error("Error inserting data:", err);
                    return res.status(500).json({ message: "Failed to add project" });
                }
                console.log("Insert successful:", result);
                res.status(200).json({ message: "Project added successfully" });
            }
        );
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}



exports.Allprojects = async (req, res) => {
    try {
        const managerId=req.user. employee_id;
        const query = "SELECT * FROM project WHERE manager_id = ?";
        const [results] = await sqlDatabase.query(query,[managerId]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No projects found for the manager" });
        }
        res.status(200).json({ message: "Projects fetched successfully", data: results });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
};
exports.Allproject=async(req,res)=>{
    
        try {
            const query = "SELECT * FROM project";
            const [results] = await sqlDatabase.query(query);
            if (results.length === 0) {
                return res.status(404).json({ message: "No projects found" });
            }
            res.status(200).json({ message: "Projects fetched successfully", data: results });
        }
    
    catch(err){
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
}
