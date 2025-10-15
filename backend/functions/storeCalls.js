import CallHistory from "../models/call.history.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

/**
 * Map of phone numbers → provider (issue) names
 */
const providerMap = {
  // Mental Health / Suicide / Emotional Distress
  "+19889882222": "Mental Health / Suicide / Emotional Distress",
  "+18556627474": "Mental Health / Suicide / Emotional Distress",
  "+15052773013": "Mental Health / Suicide / Emotional Distress",
  "+15052560288": "Mental Health / Suicide / Emotional Distress",
  "+15052722800": "Mental Health / Suicide / Emotional Distress",

  // Substance Use / Alcohol / Addiction
  "+15058418978": "Substance Use / Alcohol / Addiction",
  "+15054681555": "Substance Use / Alcohol / Addiction",
  "+15052661900": "Substance Use / Alcohol / Addiction",
  "+15059078311": "Substance Use / Alcohol / Addiction",

  // Domestic Violence / Abuse / Unsafe Relationship
  "+18007997233": "Domestic Violence / Abuse / Unsafe Relationship",
  "+15052474219": "Domestic Violence / Abuse / Unsafe Relationship",
  "+18007733645": "Domestic Violence / Abuse / Unsafe Relationship",
  "+15052483165": "Domestic Violence / Abuse / Unsafe Relationship",
  "+15058439123": "Domestic Violence / Abuse / Unsafe Relationship",
  "+15052468972": "Domestic Violence / Abuse / Unsafe Relationship",

  // Youth Crisis / Runaway / Family Issues
  "+15052609912": "Youth Crisis / Runaway / Family Issues",
  "+18553337233": "Youth Crisis / Runaway / Family Issues",
  "+15055919444": "Youth Crisis / Runaway / Family Issues",

  // LGBTQ+ Identity / Distress
  "+18664887386": "LGBTQ+ Identity / Distress",
  "+15052009086": "LGBTQ+ Identity / Distress",

  // Elder Concern / Isolation / Neglect
  "+18666543219": "Elder Concern / Isolation / Neglect",
  "+15058086325": "Elder Concern / Isolation / Neglect",

  // Food / Housing / Money / Basic Needs
  "+15053495340": "Food / Housing / Money / Basic Needs",
  "+15058426491": "Food / Housing / Money / Basic Needs",
  "+15057244604": "Food / Housing / Money / Basic Needs",
  "+15053498861": "Food / Housing / Money / Basic Needs",

  // Gambling / Financial Ruin
  "+18335454357": "Gambling / Financial Ruin"
};



/**
 * Stores call data from webhook into MongoDB
 * @param {Object} data - Webhook payload
 */
async function storeCalls(data) {
  try {
    console.log("✅ data is : ", data);
    if (!data?.call) throw new Error("Invalid data: Missing 'call' object in webhook payload");

    const call = data.call;

    // Extract phone_number and tool_type from transcript_with_tool_calls
    let phone_number = null;
    let tool_type = null;

    if (Array.isArray(call.transcript_with_tool_calls)) {
      for (const item of call.transcript_with_tool_calls) {
        if (item?.role === "tool_call_invocation" && item?.type === "transfer_call") {
          try {
            const args = JSON.parse(item.arguments || "{}");
            phone_number = args.number || null;
            tool_type = item.type || null;
            break;
          } catch (err) {
            console.warn("Failed to parse tool_call arguments:", err.message);
          }
        }
      }
    }

    // Detect provider name from the phone number mapping or emergency detection
    let provider_name = "Unknown Provider";
    
    // Check for emergency escalation indicators
    const transcript = call?.transcript || '';
    
    // Very specific emergency detection - user says emergency AND agent says call 911
    const lines = transcript.split('\n');
    let userSaidEmergency = false;
    let agentSaidCall911 = false;
    
    for (const line of lines) {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('user:') && lowerLine.includes('emergency')) {
        userSaidEmergency = true;
      }
      if (lowerLine.includes('agent:') && (lowerLine.includes('call 9-1-1') || lowerLine.includes('call 911'))) {
        agentSaidCall911 = true;
      }
    }
    
    if (userSaidEmergency && agentSaidCall911) {
      provider_name = "Escalated to Emergency";
    } else if (phone_number && providerMap[phone_number]) {
      provider_name = providerMap[phone_number];
    }

    // Extract call_analysis safely
    const call_summary = call?.call_analysis?.call_summary || null;
    const user_sentiment = call?.call_analysis?.user_sentiment || null;
    const call_successful = call?.call_analysis?.call_successful ?? null;

    // Prepare final call data
    const callData = {
      call_id: call?.call_id || "",
      agent_id: call?.agent_id || "",
      agent_name: call?.agent_name || "",
      call_status: call?.call_status || "",
      duration_ms: call?.duration_ms || 0,
      transcript: call?.transcript || "",
      collected_dynamic_variables: call?.collected_dynamic_variables || {},
      phone_number,
      tool_type,
      recording_url: call?.recording_url || "",
      disconnection_reason: call?.disconnection_reason || "",
      call_summary,
      user_sentiment,
      call_successful,
      from_number: call?.from_number || "web_call_user",
      to_number: call?.to_number || "web_call_agent",
      direction: call?.direction || "",
      provider_name
    };

    // Store in MongoDB
    const savedCall = await CallHistory.create(callData);
    console.log("✅ Call data stored successfully : ", savedCall);

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                return savedCall;
  } catch (error) {
    console.error("❌ Error while storing call data:", error);
    return error;
  }
}

export default storeCalls;
