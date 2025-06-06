import { applicationFormData, getFormById } from "../../model/user/applicationForm.model.js";

export const saveApplicationForm = async (req, res) => {
    try {
        const data = req.body;
        await applicationFormData(data);
        res.status(200).json({ message: 'Application form saved successfully' }); 
    } catch (error) {
        res.status(500).json({ error: error.message }); 
    }
};

export const checkFormSubmitted = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getFormById(id); // Query to check if form exists
        if (result.length > 0) {
            res.json({ isSubmitted: true });
        } else {
            res.json({ isSubmitted: false });
        }
    } catch (error) {
        console.error("Error checking form submission:", error);
        res.status(500).json({ error: "Failed to check form submission" });
    }
};

export const getFormData = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await getFormById(id); // Query to get form data by ID
        if (result.length > 0) {
            res.json(result[0]);
        } else {
            res.status(404).json({ message: "Form not found" });
        }
    } catch (error) {
        console.error("Error retrieving form data:", error);
        res.status(500).json({ error: "Failed to retrieve form data" });
    }
};
export const updateFormData = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = await applicationFormData(id, data); // Query to update form data by ID
        if (result.affectedRows > 0) {
            res.json({ message: "Form updated successfully" });
        } else {
            res.status(404).json({ message: "Form not found" });
        }
    } catch (error) {
        console.error("Error updating form data:", error);
        res.status(500).json({ error: "Failed to update form data" });
    }
};