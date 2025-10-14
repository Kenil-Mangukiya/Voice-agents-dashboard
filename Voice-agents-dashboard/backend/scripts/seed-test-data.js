import mongoose from 'mongoose';
import CallHistory from '../models/call.history.model.js';
import config from '../config/config.js';

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test data
const testCalls = [
  {
    call_id: 'CALL_001',
    agent_id: 'AGENT_001',
    agent_name: 'John Smith',
    call_status: 'completed',
    duration_ms: 96000, // 1:36
    transcript: 'Agent: Hello, how can I help you today?\nUser: I need help with housing assistance.',
    phone_number: '18005551234',
    tool_type: 'transfer_call',
    recording_url: 'https://example.com/recording1.mp3',
    disconnection_reason: 'call_completed',
    call_summary: 'Caller requested housing assistance and was transferred to homelessness services.',
    user_sentiment: 'Negative',
    call_successful: false,
    from_number: '18005551234',
    to_number: '18005559999',
    direction: 'inbound',
    provider_name: 'Albuquerque Rescue Mission'
  },
  {
    call_id: 'CALL_002',
    agent_id: 'AGENT_002',
    agent_name: 'Jane Doe',
    call_status: 'completed',
    duration_ms: 123000, // 2:03
    transcript: 'Agent: Good afternoon, what can I do for you?\nUser: I am feeling very anxious and need someone to talk to.',
    phone_number: '18505551234',
    tool_type: 'transfer_call',
    recording_url: 'https://example.com/recording2.mp3',
    disconnection_reason: 'call_completed',
    call_summary: 'Caller expressed anxiety and was connected to mental health services.',
    user_sentiment: 'Neutral',
    call_successful: false,
    from_number: '18505551234',
    to_number: '18005559999',
    direction: 'inbound',
    provider_name: 'Albuquerque Crisis Center'
  },
  {
    call_id: 'CALL_003',
    agent_id: 'AGENT_003',
    agent_name: 'Mike Johnson',
    call_status: 'completed',
    duration_ms: 180000, // 3:00
    transcript: 'Agent: Hello, how may I assist you?\nUser: I need help with substance abuse treatment.',
    phone_number: '19005551234',
    tool_type: 'transfer_call',
    recording_url: 'https://example.com/recording3.mp3',
    disconnection_reason: 'call_completed',
    call_summary: 'Caller seeking substance abuse treatment was connected to recovery services.',
    user_sentiment: 'Positive',
    call_successful: true,
    from_number: '19005551234',
    to_number: '18005559999',
    direction: 'inbound',
    provider_name: 'Albuquerque Treatment Services'
  },
  {
    call_id: 'CALL_004',
    agent_id: 'AGENT_004',
    agent_name: 'Sarah Wilson',
    call_status: 'completed',
    duration_ms: 240000, // 4:00
    transcript: 'Agent: Good morning, how can I help?\nUser: I am in a domestic violence situation and need help.',
    phone_number: '19505551234',
    tool_type: 'transfer_call',
    recording_url: 'https://example.com/recording4.mp3',
    disconnection_reason: 'call_completed',
    call_summary: 'Domestic violence victim was connected to safe shelter services.',
    user_sentiment: 'Negative',
    call_successful: true,
    from_number: '19505551234',
    to_number: '18005559999',
    direction: 'inbound',
    provider_name: 'Domestic Violence Resource Center'
  },
  {
    call_id: 'CALL_005',
    agent_id: 'AGENT_005',
    agent_name: 'David Brown',
    call_status: 'completed',
    duration_ms: 150000, // 2:30
    transcript: 'Agent: Hello, what brings you here today?\nUser: I am a teenager and I am having a crisis.',
    phone_number: '20005551234',
    tool_type: 'transfer_call',
    recording_url: 'https://example.com/recording5.mp3',
    disconnection_reason: 'call_completed',
    call_summary: 'Teenager in crisis was connected to youth services.',
    user_sentiment: 'Neutral',
    call_successful: true,
    from_number: '20005551234',
    to_number: '18005559999',
    direction: 'inbound',
    provider_name: 'Youth Crisis Center of Albuquerque'
  }
];

// Clear existing data and insert test data
async function seedData() {
  try {
    // Clear existing calls
    await CallHistory.deleteMany({});
    console.log('Cleared existing call data');
    
    // Insert test calls
    const insertedCalls = await CallHistory.insertMany(testCalls);
    console.log(`Inserted ${insertedCalls.length} test calls`);
    
    // Verify the data
    const totalCalls = await CallHistory.countDocuments();
    console.log(`Total calls in database: ${totalCalls}`);
    
    // Test provider filtering
    const homelessnessCalls = await CallHistory.find({
      provider_name: { $regex: 'homeless|housing|shelter|rescue|mission', $options: 'i' }
    });
    console.log(`Homelessness calls found: ${homelessnessCalls.length}`);
    
    const mentalHealthCalls = await CallHistory.find({
      provider_name: { $regex: 'mental|psychiatric|crisis|behavioral', $options: 'i' }
    });
    console.log(`Mental health calls found: ${mentalHealthCalls.length}`);
    
    console.log('Test data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test data:', error);
    process.exit(1);
  }
}

seedData();
