
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
      project_pregress,
      time_elapsed
    } = req.body;

    console.log(req.body)
    const query = `
      INSERT INTO project (
        project_name,
        owner_id,
        manager_id,
        start_date,
        end_date,
        comp_date,
        delivery_date,
        project_pregress,
        time_elapsed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      project_name,
      owner_id,
      manager_id,
      start_date,
      end_date,
      comp_date,
      delivery_date,
      project_pregress,
      time_elapsed
    ];


    const [result] = await sqlDatabase.query(query, values);

    res.status(201).json({
      message: 'Project inserted successfully',
      projectId: result.insertId
    });
  } catch (error) {
    console.error('Error inserting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




exports.Allprojects = async (req, res) => {
  try {
    const managerId = req.user.employee_id;
    const query = "SELECT * FROM project WHERE manager_id = ?";
    const [results] = await sqlDatabase.query(query, [managerId]);
    if (results.length === 0) {
      return res.status(404).json({ message: "No projects found for the manager" });
    }
    res.status(200).json({ message: "Projects fetched successfully", data: results });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};
exports.Allproject = async (req, res) => {

  try {
    const query = "SELECT * FROM project";
    const [results] = await sqlDatabase.query(query);
    if (results.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json({ message: "Projects fetched successfully", data: results });
  }

  catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
}
exports.byname = async (req, res) => {
  const { projectName } = req.query;

  try {
    const [project] = await db.query(
      'SELECT project_id FROM projects WHERE project_name = ?',
      [projectName]
    );
    res.json(project || { project_id: null });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
