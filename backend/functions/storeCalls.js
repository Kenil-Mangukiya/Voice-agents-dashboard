import CallHistory from "../models/call.history.model.js";

/**
 * Map of phone numbers → provider_name & niche
 */
const providerMap = {
  "+19889882222": { provider_name: "988 Suicide & Crisis Lifeline", niche: "Mental Health / Suicide / Emotional Distress" },
  "+18556627474": { provider_name: "988 Suicide & Crisis Lifeline", niche: "Mental Health / Suicide / Emotional Distress" },
  "+15052773013": { provider_name: "NM Crisis and Access Line (NMCAL)", niche: "Mental Health / Suicide / Emotional Distress" },
  "+15052560288": { provider_name: "AGORA Crisis Center (UNM)", niche: "Mental Health / Suicide / Emotional Distress" },
  "+15052722800": { provider_name: "NM Crisis and Access Line (NMCAL)", niche: "Mental Health / Suicide / Emotional Distress" },
  "+15058418978": { provider_name: "Bernalillo County CARE Campus Detox (MATS)", niche: "Substance Use / Alcohol / Addiction" },
  "+15054681555": { provider_name: "Turquoise Lodge Hospital", niche: "Substance Use / Alcohol / Addiction" },
  "+15052661900": { provider_name: "Alcoholics Anonymous (AA) – Albuquerque Central", niche: "Substance Use / Alcohol / Addiction" },
  "+15059078311": { provider_name: "Alcoholics Anonymous (AA) – Albuquerque Central", niche: "Substance Use / Alcohol / Addiction" },
  "+15052474219": { provider_name: "S.A.F.E. House (DV Hotline & Shelter)", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+18007733645": { provider_name: "National Domestic Violence Hotline", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+15052483165": { provider_name: "Domestic Violence Resource Center (DVRC)", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+18007997233": { provider_name: "National Domestic Violence Hotline", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+15058439123": { provider_name: "S.A.F.E. House (DV Hotline & Shelter)", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+15052468972": { provider_name: "Domestic Violence Resource Center (DVRC)", niche: "Domestic Violence / Abuse / Unsafe Relationship" },
  "+15052609912": { provider_name: "New Day Youth Shelter", niche: "Youth Crisis / Runaway / Family Issues" },
  "+18553337233": { provider_name: "New Day Youth Shelter", niche: "Youth Crisis / Runaway / Family Issues" },
  "+15055919444": { provider_name: "New Day Youth Shelter", niche: "Youth Crisis / Runaway / Family Issues" },
  "+18664887386": { provider_name: "Transgender Resource Center of NM (TGRCNM)", niche: "LGBTQ+ Identity / Distress" },
  "+15052009086": { provider_name: "Transgender Resource Center of NM (TGRCNM)", niche: "LGBTQ+ Identity / Distress" },
  "+18666543219": { provider_name: "Aging & Disability Resource Center (ADRC)", niche: "Elder Concern / Isolation / Neglect" },
  "+15058086325": { provider_name: "Aging & Disability Resource Center (ADRC)", niche: "Elder Concern / Isolation / Neglect" },
  "+15053495340": { provider_name: "Roadrunner Food Bank", niche: "Food / Housing / Money / Basic Needs" },
  "+15058426491": { provider_name: "Storehouse New Mexico", niche: "Food / Housing / Money / Basic Needs" },
  "+15057244604": { provider_name: "The Rock at Noonday", niche: "Food / Housing / Money / Basic Needs" },
  "+15053498861": { provider_name: "Storehouse New Mexico", niche: "Food / Housing / Money / Basic Needs" },
  "+18335454357": { provider_name: "Gambling Addiction Help", niche: "Gambling / Financial Ruin" }
};

async function storeCalls(data) {
  try {
    if (!data?.call) throw new Error("Invalid data: Missing 'call' object");
    const call = data.call;

    // ======= Step 1: Extract phone number =======
    let phone_number =
      call.phone_number ||
      call.collected_dynamic_variables?.phone_number ||
      null;

    // If still null, try parsing transcript_with_tool_calls
    if (!phone_number && Array.isArray(call.transcript_with_tool_calls)) {
      for (const item of call.transcript_with_tool_calls) {
        if (item.role === "tool_call_invocation" && item.type === "transfer_call") {
          try {
            const args = JSON.parse(item.arguments || "{}");
            if (args.number) {
              phone_number = args.number;
              break;
            }
          } catch (err) {
            console.warn("Failed to parse tool_call arguments:", err.message);
          }
        }
      }
    }

    // ======= Step 2: Emergency detection =======
    let provider_name = "Unknown Provider";
    let niche = "Unknown Niche";

    const transcript = call.transcript || '';
    const lines = transcript.split('\n');
    const userSaidEmergency = lines.some(line =>
      line.toLowerCase().includes('user:') && line.toLowerCase().includes('emergency')
    );
    const agentSaidCall911 = lines.some(line =>
      line.toLowerCase().includes('agent:') &&
      (line.toLowerCase().includes('call 911') || line.toLowerCase().includes('call 9-1-1'))
    );

    if (userSaidEmergency && agentSaidCall911) {
      provider_name = "Escalated to Emergency";
      niche = "Emergency";
    } else if (phone_number && providerMap[phone_number]) {
      provider_name = providerMap[phone_number].provider_name;
      niche = providerMap[phone_number].niche;
    }

    // ======= Step 3: Extract analysis =======
    const call_summary = call?.call_analysis?.call_summary || call.call_summary || '';
    const user_sentiment = call?.call_analysis?.user_sentiment || call.user_sentiment || null;
    const call_successful = call?.call_analysis?.call_successful ?? call.call_successful ?? null;

    // ======= Step 4: Prepare final call data =======
    const callData = {
      call_id: call.call_id || "",
      agent_id: call.agent_id || "",
      agent_name: call.agent_name || "",
      call_status: call.call_status || "",
      duration_ms: call.duration_ms || 0,
      transcript,
      collected_dynamic_variables: call.collected_dynamic_variables || {},
      phone_number,
      recording_url: call.recording_url || "",
      tool_type: call.tool_type || null,
      disconnection_reason: call.disconnection_reason || "",
      call_summary,
      user_sentiment,
      call_successful,
      from_number: call.from_number || "web_call_user",
      to_number: call.to_number || "web_call_agent",
      direction: call.direction || "",
      provider_name,
      niche,
      createdAt: call.createdAt || new Date(),
      updatedAt: call.updatedAt || new Date()
    };

    // ======= Step 5: Save to DB =======
    const savedCall = await CallHistory.create(callData);
    console.log("✅ Call stored successfully:", savedCall.call_id);
    return savedCall;

  } catch (error) {
    console.error("❌ Error storing call:", error);
    return error;
  }
}

export default storeCalls;
