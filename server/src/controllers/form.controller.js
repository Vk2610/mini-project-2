import { saveFormData as saveFormToDB, getFormById } from "../model/form.model.js";

// Save form data
export const saveFormData = async (req, res) => {
  try {
    const formData = req.body;

    // Validate required fields
    if (
      !formData.lastName ||
      !formData.firstName ||
      !formData.email ||
      !formData.dateOfAppointment ||
      !formData.dateOfBirth
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Form data received:", formData);

    // Save to database
    const result = await saveFormToDB(formData);
    console.log("Database result:", result);

    res.status(200).json({ message: "Form data saved successfully" });
  } catch (error) {
    console.error("Error saving form data:", error);
    res.status(500).json({ message: "Error saving form data" });
  }
};

// Get form data by ID
export const getForm = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = await getFormById(id);
    if (!formData) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(formData);
  } catch (error) {
    console.error("Error fetching form data:", error);
    res.status(500).json({ message: "Error fetching form data" });
  }
};