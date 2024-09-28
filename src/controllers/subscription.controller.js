import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const userId = req.user._id

    const existingSubscription = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if (existingSubscription) {
        // Unsubscribe
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(
            new ApiResponse(200, {}, "Unsubscribed successfully")
        )
    } else {
        // Subscribe
        const newSubscription = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
        return res.status(201).json(
            new ApiResponse(201, newSubscription, "Subscribed successfully")
        )
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    const subscribers = await Subscription.find({ channel: channelId })
        .populate('subscriber', 'username email')
        .select('subscriber -_id');

    if (!subscribers) {
        throw new ApiError(404, "No subscribers found for this channel");
    }

    const subscriberCount = subscribers.length;

    return res.status(200).json(
        new ApiResponse(
            200, 
            { subscribers: subscribers.map(sub => sub.subscriber), count: subscriberCount }, 
            "Subscribers fetched successfully"
        )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscribedChannels = await Subscription.find({ subscriber: subscriberId })
        .populate('channel', 'username email')
        .select('channel -_id');

    if (!subscribedChannels || subscribedChannels.length === 0) {
        throw new ApiError(404, "No subscribed channels found for this user");
    }

    const channelCount = subscribedChannels.length;

    return res.status(200).json(
        new ApiResponse(
            200, 
            { 
                channels: subscribedChannels.map(sub => sub.channel), 
                count: channelCount 
            }, 
            "Subscribed channels fetched successfully"
        )
    );
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}