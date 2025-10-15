import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
  {
    call_id: {
      type: String,
      required: true,
    },
    agent_id: {
      type: String,
      required: true,
    },
    agent_name: {
      type: String,
      required: true,
    },
    call_status: {
      type: String,
      required: true,
    },
    duration_ms: {
      type: Number,
    },
    transcript: {
      type: String, // store full transcript text
    },
    collected_dynamic_variables: {
      type: Object,
    },
    // extracted from transcript_with_tool_calls
    phone_number: {
      type: String, // extracted from tool_call.arguments.number
    },
    tool_type: {
      type: String, // e.g., "transfer_call"
    },
    recording_url: {
      type: String,
    },
    disconnection_reason: {
      type: String,
    },
    // from call_analysis
    call_summary: {
      type: String,
    },
    user_sentiment: {
      type: String,
    },
    call_successful: {
      type: Boolean,
    },
    from_number: {
      type: String,
      required: true,
    },
    to_number: {
      type: String,
      required: true,
    },
    direction: {
      type: String,
    },
    provider_name: {
      type: String,
      required: true,
    },
    niche: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CallHistory = mongoose.model("callhistory_data", callHistorySchema);

export default CallHistory;
