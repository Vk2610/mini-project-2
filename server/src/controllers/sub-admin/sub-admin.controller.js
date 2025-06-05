import { getSubAdminById, updateSubAdmin, getUsersByBranchName } from '../../model/sub-admin/sub-admin.model.js';

export const getSubAdminController = async (req, res) => {
    try {
        const { id } = req.params;

        // Debug log
        console.log('Request params:', { id });

        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Sub-admin ID is required'
            });
        }

        const subAdmin = await getSubAdminById(id);

        return res.status(200).json({
            success: true,
            data: subAdmin
        });

    } catch (error) {
        console.error('Controller error:', error);
        return res.status(error.message.includes('not found') ? 404 : 500).json({
            success: false,
            message: error.message
        });
    }
}

export const updateSubAdminController = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullname, email, branch_name, branch_region_name, phone_number } = req.body;
        const result = await updateSubAdmin(id, fullname, email, branch_name, branch_region_name, phone_number);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Sub-admin not found" });
        }
        res.status(200).json({ message: "Sub-admin updated successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const getUsersByBranch = async (req, res) => {
    try {
        const { branch_name } = req.params;

        // Debug log
        console.log('Requesting users for branch:', branch_name);

        if (!branch_name) {
            return res.status(400).json({
                message: 'Branch name is required'
            });
        }

        const users = await getUsersByBranchName(branch_name);

        // Debug log
        // console.log('Found users:', users);

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: `No users found for branch: ${branch_name}`
            });
        }

        res.status(200).json({
            success: true,
            users: users,
            total: users.length
        });

    } catch (error) {
        console.error('Error in getUsersByBranch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};
