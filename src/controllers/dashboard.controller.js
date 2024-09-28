import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const totalSubscribers = await Subscription.countDocuments({ channel: userId })
    
    const videoStats = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            totalViews: { $sum: "$views" }
        }}
    ])

    const totalLikes = await Like.countDocuments({
        video: { $in: await Video.find({ owner: userId }).distinct('_id') }
    })

    const stats = {
        totalSubscribers,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalLikes
    }

    return res.status(200).json(
        new ApiResponse(200, stats, "Channel stats fetched successfully")
    )
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .select('-owner')

    if (!videos || videos.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "No videos found for this channel")
        )
    }

    return res.status(200).json(
        new ApiResponse(200, videos, "Channel videos fetched successfully")
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }