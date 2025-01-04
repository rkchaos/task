const sqlDatabase = require("../databse");

exports.allUser = async (req, res) => {
    try {
        const [rows, fields] = await sqlDatabase.execute("SELECT * FROM employees");
        res.status(200).json({
            success: true,
            data: rows,
            current: req.user
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};
exports.particular = async (req, res) => {
    try {
        const managerId = req.user.employee_id;

        const query = "SELECT * FROM employees WHERE manager_id = ?";
        const [results] = await sqlDatabase.query(query, [managerId]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No the manager" });
        }
        res.status(200).json({ message: "Projects fetched successfully", data: results });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ message: "Failed to fetch projects" });
    }
}
exports.getTeamWithProjects = async (req, res) => {
    try {
        const managerId = req.user.employee_id;

        const query = `
    SELECT 
        e.employee_id,
        e.name,
        e.mobile_number,
        e.email,
        e.manager_id,
        e.department,
        e.designation,
        GROUP_CONCAT(DISTINCT p.project_name SEPARATOR ', ') AS project
    FROM employees e
    LEFT JOIN tasks t ON e.employee_id = t.assigned_employee_id
    LEFT JOIN project p ON t.project_id = p.project_id
    WHERE e.manager_id = ?
    GROUP BY e.employee_id;
`;

        const [results] = await sqlDatabase.query(query, [managerId]);

        res.status(200).json({
            message: "Team members fetched successfully",
            team: results,
        });
    } catch (err) {
        console.error("Error fetching team members:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getEmployeeTeam = async (req, res) => {
    try {
        const employeeId = req.user.employee_id;  // Logged-in employee's ID

        // Step 1: Get the manager_id of the employee using their employee_id
        const managerQuery = `
            SELECT manager_id 
            FROM employees 
            WHERE employee_id = ?;
        `;

        const [managerResult] = await sqlDatabase.query(managerQuery, [employeeId]);

        if (managerResult.length === 0) {
            return res.status(404).json({ message: "Employee not found." });
        }

        const managerId = managerResult[0].manager_id;

        // Step 2: Now, fetch all employees with the same manager_id
        const teamQuery = `
            SELECT 
                e.employee_id,
                e.name,
                e.mobile_number,
                e.email,
                e.manager_id,
                e.department,
                e.designation,
                p.project_name,
                t.start_date,
                t.deadline,
                t.progress_percentage AS project_progress,
                t.comp_date,
                t.task_manager_id
            FROM employees e
            LEFT JOIN tasks t ON e.employee_id = t.assigned_employee_id
            LEFT JOIN project p ON t.project_id = p.project_id
            WHERE e.manager_id = ?
            ORDER BY e.employee_id;
        `;

        const [teamResults] = await sqlDatabase.query(teamQuery, [managerId]);

        // Step 3: Send the results to the frontend
        res.status(200).json({
            message: "Team fetched successfully.",
            team: teamResults,
        });
    } catch (err) {
        console.error("Error fetching team members:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};
