import { getUserCount, getSubAdminCount, getBranchCount } from '../model/stat.model.js';

export const getCountOfUsers = async (req, res) => {
    try {
        const count = await getUserCount();
        res.status(200).json({ 
            success: true,
            userCount: count 
        });
    } catch (error) {
        console.error('Controller error in getCountOfUsers:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get user count",
            error: error.message 
        });
    }
};

export const getCountOfSubAdmins = async (req, res) => {
    try {
        const count = await getSubAdminCount();
        res.status(200).json({ 
            success: true,
            subAdminCount: count 
        });
    } catch (error) {
        console.error('Controller error in getCountOfSubAdmins:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get sub-admin count",
            error: error.message 
        });
    }
};

export const getCountOfBranches = async (req, res) => {
    try {
        const count = await getBranchCount();
        res.status(200).json({ 
            success: true,
            branchCount: count 
        });
    } catch (error) {
        console.error('Controller error in getCountOfBranches:', error);
        res.status(500).json({ 
            success: false,
            message: "Failed to get branch count",
            error: error.message 
        });
    }
};