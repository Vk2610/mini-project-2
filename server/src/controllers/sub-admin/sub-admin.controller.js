import { getSubAdminById, updateSubAdmin, getUsersByBranchName, getApplicationFormsByBranchName, updateApplicationFormStatus, getApplicationFormById } from '../../model/sub-admin/sub-admin.model.js';
import { Approved_ApplicationForm, Rejected_ApplicationForm } from '../../config/Handle_email.js';
import { GiMailShirt } from 'react-icons/gi';

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
        const { Employee_Name, Email_ID, Branch_Name, Branch_Region_Name, Mobile_No } = req.body;
        const result = await updateSubAdmin(id, Employee_Name, Email_ID, Branch_Name, Branch_Region_Name, Mobile_No);
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


export const getApplicationFormsByBranch = async (req, res) => {
    try {
        const { branch_name } = req.params;

        // Debug log
        console.log('Requesting application forms for branch:', branch_name);

        if (!branch_name) {
            return res.status(400).json({
                message: 'Branch name is required'
            });
        }

        const applicationForms = await getApplicationFormsByBranchName(branch_name);

        // Debug log
        // console.log('Found application forms:', applicationForms);

        if (!applicationForms || applicationForms.length === 0) {
            return res.status(404).json({
                message: `No application forms found for branch: ${branch_name}`
            });
        }

        res.status(200).json({
            success: true,
            applicationForms: applicationForms,
            total: applicationForms.length
        });

    } catch (error) {
        console.error('Error in getApplicationFormsByBranch:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application forms',
            error: error.message
        });
    }
};

export const updateApplicationFormStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remarks } = req.body;

        // Debug log
        console.log('Updating application form status:', { id, status, remarks });

        if (!id || !status) {
            return res.status(400).json({
                success: false,
                message: 'Application ID and status are required'
            });
        }

        const result = await updateApplicationFormStatus(id, status, remarks);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Application form not found"
            });
        }

        // Get the application details for email
        const applicationForm = await getApplicationFormById(id);

        if (!applicationForm) {
            throw new Error('Application details not found');
        }

        // Send email based on status
        if (status.toLowerCase() === 'approved') {
            await Approved_ApplicationForm(
                applicationForm.email,
                applicationForm.name,
                applicationForm.memberNo,
                remarks || 'Your application has been approved'
            );
        } else if (status.toLowerCase() === 'rejected') {
            await Rejected_ApplicationForm(
                applicationForm.email,
                applicationForm.name,
                applicationForm.memberNo,
                remarks || 'Your application has been rejected'
            );
        }

        res.status(200).json({
            success: true,
            message: "Application form status updated successfully",
            emailSent: true
        });

    } catch (error) {
        console.error('Error in updateApplicationFormStatusController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application form status',
            error: error.message
        });
    }
};