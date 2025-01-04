const sqlDatabase = require("../databse");

exports.taska = async (req, res) => {
    try {
        const {
            projectId,
            taskName,
            priority,
            status,
            startDate,
            deadline,
            taskOwner,
            assignedEmployeeId,
            createdBy,
            progressPercentage,
            updatedAt,
            notes
        } = req.body;

        const query = `
      INSERT INTO tasks (
        project_id,
        task_name,
        priority,
        status,
        start_date,
        deadline,
        task_manager_id,
        assigned_employee_id,
        created_by,
        progress_percentage,
        updated_at,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const values = [
            projectId,
            taskName,
            priority,
            status,
            startDate,
            deadline,
            taskOwner,
            assignedEmployeeId,
            createdBy,
            progressPercentage,
            updatedAt,
            notes
        ];

        const [result] = await sqlDatabase.query(query, values);

        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertId
        });

    } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// exports.allTasks = async (req, res) => {
//     try {
//         const query = "SELECT * FROM tasks";
//         const [tasks] = await sqlDatabase.query(query);

//         if (tasks.length > 0) {
//             res.status(200).json({
//                 message: "Tasks fetched successfully",
//                 tasks: tasks
//             });
//         } else {
//             res.status(404).json({
//                 message: "No tasks found"
//             });
//         }
//     } catch (error) {
//         console.error("Error fetching tasks:", error);
//         res.status(500).json({
//             error: "Internal server error"
//         });
//     }
// }
// Controller Function
exports.getTasks = async (req, res) => {
    try {
        const userRole = req.user.designation; 
        const employeeId = req.user.employee_id; 
        let query;
        let params = [];

        
        if (userRole === "owner" || userRole === "admin") {
           
            query = `SELECT * FROM tasks;`;
        } else if (userRole === "manager") {
           
            query = `
                SELECT *
                FROM tasks
                WHERE task_manager_id = ? OR assigned_employee_id IN (
                    SELECT employee_id
                    FROM employees
                    WHERE manager_id = ?
                );
            `;
            params = [employeeId, employeeId];
        } else if (userRole === "employee") {
           
            query = `SELECT * FROM tasks WHERE assigned_employee_id = ?;`;
            params = [employeeId];
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }

     
        const [tasks] = await sqlDatabase.query(query, params);

        
        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }

        
        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks
        });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// exports.getTasksForManager = async (req, res) => {
//     try {
//         const managerId = req.user.employee_id;  // Assuming the user has employee_id set in JWT

//         const query = `
//             SELECT * 
//             FROM tasks 
//             WHERE task_manager_id = ?
//         `;

//         const [tasks] = await sqlDatabase.query(query, [managerId]);

//         if (tasks.length === 0) {
//             return res.status(404).json({ message: "No tasks assigned this manager." });
//         }

//         res.status(200).json({
//             message: "Tasks fetched successfully",
//             tasks
//         });
//     } catch (err) {
//         console.error("Error fetching tasks for manager:", err);
//         res.status(500).json({
//             error: "Internal server error"
//         });
//     }
// };

