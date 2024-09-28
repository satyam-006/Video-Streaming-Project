import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    // Prepare the filter object
    const filter = {}
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    }
    if (userId) {
        filter.owner = userId
    }

    // Prepare the sort object
    const sort = {}
    if (sortBy) {
        sort[sortBy] = sortType === 'desc' ? -1 : 1
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Fetch videos
    const videos = await Video.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'username')

    // Get total count for pagination
    const totalVideos = await Video.countDocuments(filter)

    // Send response
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            currentPage: page,
            totalPages: Math.ceil(totalVideos / limit),
            totalVideos
        }, "Videos fetched successfully")
    )
    

})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required")
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoFile) {
        throw new ApiError(500, "Video file upload failed")
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail?.url || "",
        title,
        description,
        duration: videoFile.duration,
        owner: req.user._id
    })

    const createdVideo = await Video.findById(video._id).populate("owner", "username")

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while creating the video")
    }

    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video published successfully")
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId).populate("owner", "username")

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    // Increment view count
    video.views += 1
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to update this video")
    }

    if (title) {
        video.title = title
    }

    if (description) {
        video.description = description
    }

    if (req.files && req.files.thumbnail) {
        const thumbnailLocalPath = req.files.thumbnail[0]?.path

        if (!thumbnailLocalPath) {
            throw new ApiError(400, "Thumbnail file is required")
        }

        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if (thumbnail) {
            video.thumbnail = thumbnail.url
        }
    }

    await video.save({ validateBeforeSave: false })
    return res.status(200).json(
        new ApiResponse(200, video, "Video updated successfully")
    )


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You don't have permission to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    video.isPublic = !video.isPublic
    await video.save()

    return res.status(200).json(
        new ApiResponse(200, video, "Video publish status updated successfully")
    )
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}