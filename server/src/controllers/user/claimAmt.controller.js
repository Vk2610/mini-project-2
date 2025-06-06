import { claimAmtData, getAllClaimAmtForms, getClaimAmtFormById } from "../../model/user/claimAmt.model.js";

export const claimAmt = async (req, res) => {
    try {
        const data = req.body;
        const result = await claimAmtData(data);
        res.status(200).json({ message: 'ClaimAmt data saved successfully', result }); // Updated response message
    } catch (error) {
        console.error('Error saving claimAmt data:', error);
        res.status(500).json({ message: 'ClaimAmt data saving failed', error: error.message }); // Updated response message
    }
};

export const getAllClaimAmt = async (req, res) => {
    try {
        const claimAmtForms = await getAllClaimAmtForms();
        res.status(200).json(claimAmtForms);
    } catch (error) {
        console.error('Error fetching all claimAmt forms:', error);
        res.status(500).json({ message: 'Failed to fetch claimAmt forms', error: error.message });
    }
}

export const getClaimAmtById = async (req, res) => {
    const { id } = req.params;
    try {
        const claimAmtForm = await getClaimAmtFormById(id);
        if (!claimAmtForm) {
            return res.status(404).json({ message: 'ClaimAmt form not found' });
        }
        res.status(200).json(claimAmtForm);
    } catch (error) {
        console.error('Error fetching claimAmt form by ID:', error);
        res.status(500).json({ message: 'Failed to fetch claimAmt form', error: error.message });
    }
};
