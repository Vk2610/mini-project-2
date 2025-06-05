import { claimAmtData } from "../model/claimAmt.model.js";

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


