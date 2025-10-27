import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import storeCalls from "../functions/storeCalls.js";

const webhook = asyncHandler(async (req, res) => {
    console.log("✅ Webhook received : ", req.body);
    if(req.body.event == "call_analyzed")
    {
        if(req.body.call.agent_id == "agent_5f47995e26fc268bce24e778ab" || req.body.call.agent_id == "agent_464bf5d0525e5abd663f5899c7")
        {
        try
        {
            console.log("Calling function to store calls")
            const call = await storeCalls(req.body);
            console.log("✅ Call data stored successfully : ", call);
            return res.status(200).json(new apiResponse(200, call, "Call data stored successfully"));
        }
        catch(error)
        {
            console.log("❌ Error while storing call data : ", error);
            return res.status(500).json(new apiError(500, "Internal Server Error",error.message));
        }
    }
}
    else
    {
        return
    }
})

export default webhook;