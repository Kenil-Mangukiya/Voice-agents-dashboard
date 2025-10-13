import CallHistory from "../models/call.history.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

/**
 * Map of phone numbers → provider (issue) names
 */
const providerMap = {
  // Mental Health / Suicide / Emotional Distress
  "+18556009276": "Mental Health / Suicide / Emotional Distress",
  "+18563630633": "Mental Health / Suicide / Emotional Distress",
  "+18887247240": "Mental Health / Suicide / Emotional Distress",
  "+18777244747": "Mental Health / Suicide / Emotional Distress",
  "+17149916412": "Mental Health / Suicide / Emotional Distress",
  "+19163683111": "Mental Health / Suicide / Emotional Distress",
  "+18552784204": "Mental Health / Suicide / Emotional Distress",
  "+14157810500": "Mental Health / Suicide / Emotional Distress",
  "+16282068125": "Mental Health / Suicide / Emotional Distress",
  "+16282177000": "Mental Health / Suicide / Emotional Distress / Substance Use",

  // Substance Use / Alcohol / Addiction
  "+18448047500": "Substance Use / Alcohol / Addiction",
  "+18662101303": "Substance Use / Alcohol / Addiction",
  "+18009682636": "Substance Use / Alcohol / Addiction",
  "+14158341144": "Substance Use / Alcohol / Addiction",

  // Domestic Violence / Abuse / Unsafe Relationship
  "+18007997233": "Domestic Violence / Abuse / Unsafe Relationship",
  "+18006564673": "Domestic Violence / Abuse / Unsafe Relationship",
  "+18663319474": "Domestic Violence / Abuse / Unsafe Relationship",
  "+18779435778": "Domestic Violence / Abuse / Unsafe Relationship",
  "+17149572737": "Domestic Violence / Abuse / Unsafe Relationship",
  "+19498319110": "Domestic Violence / Abuse / Unsafe Relationship",
  "+14156477273": "Domestic Violence / Abuse / Unsafe Relationship",

  // Youth Crisis / Runaway / Family Issues
  "+18008435200": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",
  "+18004483000": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",
  "+18008528336": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",
  "+18007862929": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",
  "+14082793000": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",
  "+14088506125": "Youth Crisis / Runaway / Family Issues / LGBTQ+ Identity",

  // Elder Concern / Isolation / Neglect
  "+18884363600": "Elder Concern / Isolation / Neglect",
  "+18004515155": "Elder Concern / Isolation / Neglect",
  "+18004917123": "Elder Concern / Isolation / Neglect",
  "+18774773646": "Elder Concern / Isolation / Neglect",
  "+18005102020": "Elder Concern / Isolation / Neglect",
  "+18886701360": "Elder Concern / Isolation / Neglect",

  // Food / Housing / Money / Basic Needs
  "+18005486047": "Food / Housing / Money / Basic Needs",
  "+14083852400": "Food / Housing / Money / Basic Needs",
  "+18005694287": "Food / Housing / Money / Basic Needs",
  "+18009552232": "Food / Housing / Money / Basic Needs",
  "+18778473663": "Food / Housing / Money / Basic Needs",

  // Gambling / Financial Ruin
  "+18004262537": "Gambling / Financial Ruin"
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
