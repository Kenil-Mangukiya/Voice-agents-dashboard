import CallHistory from "../models/call.history.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";


/**
 * Get all calls with counts per provider and per niche
 */
const getAllCalls = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sentiment = '',
      call_successful = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      days = '',
      provider = ''
    } = req.query;

    const filter = {};

    // Time range filter
    if (days) {
      const n = parseInt(days);
      if (!isNaN(n) && n > 0) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - n);
        filter.createdAt = { $gte: startDate };
      }
    }

    // Sentiment filter
    if (sentiment) filter.user_sentiment = sentiment;

    // Call success filter
    if (call_successful !== '') filter.call_successful = call_successful === 'true';

    // Provider filter
    if (provider) {
      // Map frontend provider keys to backend provider names
      const providerMap = {
        'mental': ['mental', 'psychiatric', 'crisis', 'suicide'],
        'domestic': ['domestic', 'violence', 'abuse', 'safe'],
        'substance': ['substance', 'alcohol', 'addiction', 'detox'],
        'homeless': ['homeless', 'housing', 'shelter', 'rescue', 'mission', 'food', 'money', 'basic needs'],
        'youth': ['youth', 'teen', 'child', 'adolescent', 'runaway'],
        'lgbtq': ['lgbtq', 'identity', 'transgender'],
        'elder': ['elder', 'senior', 'aging', 'disability'],
        'gambling': ['gambling', 'financial'],
        'emergency': ['emergency', 'escalated', '911']
      };
      
      const searchTerms = providerMap[provider] || [provider];
      filter.$or = searchTerms.map(term => ({
        $or: [
          { provider_name: { $regex: term, $options: 'i' } },
          { niche: { $regex: term, $options: 'i' } }
        ]
      }));
    }

    // Fetch all calls matching filters
    let calls = await CallHistory.find(filter)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .lean();

    // Apply search filter (optional)
    if (search) {
      const term = search.toLowerCase();
      calls = calls.filter(call =>
        (call.call_id && call.call_id.toLowerCase().includes(term)) ||
        (call.agent_name && call.agent_name.toLowerCase().includes(term)) ||
        (call.transcript && call.transcript.toLowerCase().includes(term)) ||
        (call.call_summary && call.call_summary.toLowerCase().includes(term)) ||
        (call.provider_name && call.provider_name.toLowerCase().includes(term)) ||
        (call.niche && call.niche.toLowerCase().includes(term)) ||
        (call.phone_number && call.phone_number.includes(term))
      );
    }

    // Pagination
    const totalItems = calls.length;
    const totalPages = Math.ceil(totalItems / parseInt(limit));
    const paginatedCalls = calls.slice((page - 1) * limit, page * limit);

    // Format calls
    const formattedCalls = paginatedCalls.map(call => ({
      id: call._id,
      call_id: call.call_id,
      agent_name: call.agent_name,
      call_status: call.call_status,
      duration_ms: call.duration_ms,
      transcript: call.transcript,
      phone_number: call.phone_number,
      recording_url: call.recording_url,
      disconnection_reason: call.disconnection_reason,
      call_summary: call.call_summary,
      user_sentiment: call.user_sentiment,
      call_successful: call.call_successful,
      from_number: call.from_number,
      to_number: call.to_number,
      provider_name: call.provider_name || 'Unknown Provider',
      niche: call.niche || 'Unknown',
      createdAt: call.createdAt,
      updatedAt: call.updatedAt
    }));

    // Calculate total calls per provider & niche
    const countsPerProvider = {};
    const countsPerNiche = {};

    calls.forEach(call => {
      const provider = call.provider_name || 'Unknown Provider';
      const niche = call.niche || 'Unknown';

      countsPerProvider[provider] = (countsPerProvider[provider] || 0) + 1;
      countsPerNiche[niche] = (countsPerNiche[niche] || 0) + 1;
    });
    console.log('📊 Counts per provider:', countsPerProvider);

    res.status(200).json(
      new apiResponse(200, {
        calls: formattedCalls,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems,
          itemsPerPage: parseInt(limit)
        },
        countsPerProvider, // Total calls per provider
        countsPerNiche     // Total calls per niche
      }, "Calls fetched successfully").toJSON()
    );

  } catch (error) {
    console.error("Error fetching calls:", error);
    res.status(500).json(
      new apiResponse(500, null, "Failed to fetch calls").toJSON()
    );
  }
});

/**
 * Get call statistics
 */
const getCallStats = asyncHandler(async (req, res) => {
  try {
    const { timeRange = '7' } = req.query;
    
    // Calculate date range
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get statistics
    const totalCalls = await CallHistory.countDocuments({
      createdAt: { $gte: startDate }
    });

    const successfulCalls = await CallHistory.countDocuments({
      createdAt: { $gte: startDate },
      call_successful: true
    });

    const sentimentStats = await CallHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$user_sentiment",
          count: { $sum: 1 }
        }
      }
    ]);

    const providerStats = await CallHistory.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$provider_name",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json(
      new apiResponse(200, {
        totalCalls,
        successfulCalls,
        successRate: totalCalls > 0 ? (successfulCalls / totalCalls * 100).toFixed(1) : 0,
        sentimentStats,
        providerStats
      }, "Call statistics fetched successfully").toJSON()
    );

  } catch (error) {
    console.error("Error fetching call statistics:", error);
    res.status(500).json(
      new apiResponse(500, null, "Failed to fetch call statistics").toJSON()
    );
  }
});

export { getAllCalls, getCallStats };
