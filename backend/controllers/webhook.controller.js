import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import storeCalls from "../functions/storeCalls.js";

const webhook = asyncHandler(async (req, res) => {
    console.log("✅ Webhook received : ", req.body);
    if(req.body.event == "call_analyzed")
    {
        try
        {
            const call = await storeCalls(req.body);
            return res.status(200).json(new apiResponse(200, call, "Call data stored successfully"));
        }
        catch(error)
        {
            console.log("❌ Error while storing call data : ", error);
            return res.status(500).json(new apiError(500, "Internal Server Error",error.message));
        }
    }
    else
    {
        return
    }
})

export default webhook;