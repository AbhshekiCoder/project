import salesModel from "../../Models/salesModel.js";

const purchase_update = async (req, res) => {
    try {
        const { purchaseData } = req.body;
        console.log(purchaseData)
        
         if (!purchaseData || !Array.isArray(purchaseData.products) ){
            return res.status(400).json({
                success: false,
                message: "Invalid request data structure"
            });
        }
         
        // Create array of promises for insertion
        const insertionPromises = purchaseData.products.map(async (element) => {
            const purchaseDoc = {
                product_name: element.name,
                product_id: element.id,
                price: element.price,
                quantity: element.quantity,
                box: element.box || 0,
                CGST: element.CGST || 0,
                SGST: element.SGST || 0,
                HSN: element.HSN || '',
             
                type: "purchase",
                distributor: purchaseData.distributor,
                payment_type: purchaseData.payment_type,
                ref: purchaseData.paymentRef,
                amount: element.price * element.quantity,
                date: purchaseData.date,
                salesMan: "Accountant",
                mode: purchaseData.payment_type
            };

            return salesModel.create(purchaseDoc);
        });

        // Execute all insertions
        const insertedPurchases = await Promise.all(insertionPromises);
        
        // Get complete purchase records
        const result = await salesModel.find({
            _id: { $in: insertedPurchases.map(p => p._id) }
        }).sort({ createdAt: -1 });
        console.log(result)

        res.status(201).json({
            success: true,
            message: "Purchase created successfully",
            data: result
        });
        

    } catch (err) {
        console.error("Purchase Error:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while processing purchase",
            error: err.message
        });
    }
};

export default purchase_update;