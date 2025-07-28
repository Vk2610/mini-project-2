import { getAdminProfile, getAllSubAdmins, getSubadmin, editSubAdmin, updateAdmin, getApplications, getApplicationId, updateApplicationStatus } from '../../model/Admin/admin.model.js'

export const getAdminProfileController = async (req, res) => {
    try {
        const { id } = req.params;
        const adminProfile = await getAdminProfile(id);
        if (!adminProfile) {
            return res.status(404).json({ message: "Admin profile not found" });
        }
        res.status(200).json(adminProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getAllSubAdminsController = async (req, res) => {
    try {
        const subAdmins = await getAllSubAdmins();
        res.status(200).json(subAdmins);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getSubadminById = async (req, res) => {
    try {
        const { id } = req.params;
        const subAdmin = await getSubadmin(id);
        if (subAdmin.length === 0) {
            return res.status(404).json({ message: "Sub-admin not found" });
        }
        res.status(200).json(subAdmin[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const editSubAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const result = await editSubAdmin(id, data);
        if (result) {
            res.status(200).json({ message: "Sub-admin updated successfully" });
        } else {
            res.status(404).json({ message: "Sub-admin not found or no changes made" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateAdminProfileController = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validate updates
        const allowedUpdates = ['Mobile_No', 'Email_ID']; // Updated field names
        const updateFields = Object.keys(updates);
        const isValidOperation = updateFields.every(field => allowedUpdates.includes(field));

        if (!isValidOperation) {
            return res.status(400).json({
                success: false,
                message: "Invalid updates"
            });
        }

        const success = await updateAdmin(id, updates);

        if (!success) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        });

    } catch (error) {
        console.error("Error updating admin profile:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

export const getApplicationsController = async (req, res) => {
    try {
        const applications = await getApplications();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getApplicationByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const application = await getApplicationId(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateApplicationStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const success = await updateApplicationStatus(id, status);
        if (!success) {
            return res.status(404).json({ message: "Application not found or no changes made" });
        }

        res.status(200).json({ message: "Application status updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

