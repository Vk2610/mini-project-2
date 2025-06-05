import { saveReceipt, getReceiptById } from '../../model/user/receipt.model.js';


export const createReceipt = async (req, res) => { 
    try {
        const { id, name, address, mobile, amount, accountNumber, totalAmount, sendDate, signature } = req.body;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Receipt ID is required'
            });
        }

        // Validate other required fields
        if (!name || !address || !mobile || !amount || !accountNumber || !totalAmount || !sendDate || !signature) {
            return res.status(400).json({
                success: false,
                message: 'All fields including signature are required'
            });
        }

        // Check if receipt already exists
        try {
            const existingReceipt = await getReceiptById(id);
            if (existingReceipt) {
                return res.status(409).json({
                    success: false,
                    message: 'Receipt already exists for this ID'
                });
            }
        } catch (err) {
            if (!err.message.includes('not found')) {
                throw err;
            }
        }

        const receipt = await saveReceipt({
            id,
            name,
            address,
            mobile,
            amount,
            accountNumber,
            totalAmount,
            sendDate,
            signature
        });

        return res.status(201).json({
            success: true,
            data: receipt
        });
    } catch (error) {
        console.error('Error creating receipt:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getReceipt = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Receipt ID is required'
            });
        }

        const receipt = await getReceiptById(id);

        return res.status(200).json({
            success: true,
            data: receipt
        });

    } catch (error) {
        console.error('Error fetching receipt:', error);
        return res.status(error.message.includes('not found') ? 404 : 500).json({
            success: false,
            message: error.message
        });
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