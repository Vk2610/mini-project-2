import { getAllSubAdmins, getSubadmin, editSubAdmin } from '../../model/Admin/admin.model.js'

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