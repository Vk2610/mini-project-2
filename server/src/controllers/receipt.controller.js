import { saveReceipt, getReceiptById } from '../model/receipt.model.js';

export const createReceipt = async (req, res) => {
    try {
        const { name, address, mobile, amount, accountNumber, totalAmount, sendDate } = req.body;

        // Validate required fields
        if (!name || !address || !mobile || !amount || !accountNumber || !totalAmount || !sendDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const receipt = await saveReceipt(req.body);
        res.status(201).json({ message: 'Receipt created successfully', receipt });
    } catch (error) {
        console.error('Error creating receipt:', error);
        res.status(500).json({ message: 'Receipt creation failed', error: error.message });
    }
};

export const getReceipt = async (req, res) => {
    try {
        const receipt = await getReceiptById(req.params.id);
        if (!receipt) {
            return res.status(404).json({ message: 'Receipt not found' });
        }
        res.status(200).json(receipt);
    } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).json({ message: 'Error fetching receipt', error: error.message });
    }
};

// check if the receipt is already created
export const checkReceipt = async (req, res) => {
  const { id } = req.params;

  try {
    const receipt = await getReceiptById(id); // Query to check if receipt exists
    if (receipt) {
      res.json({ isReceiptCreated: true });
    } else {
      res.json({ isReceiptCreated: false });
    }
  } catch (error) {
    console.error("Error checking receipt:", error);
    res.status(500).json({ error: "Failed to check receipt" });
  }
};