# Video Streaming Platform

## Overview

This project is a **Video Streaming Platform** where users can upload, stream, and watch videos. The platform is built using modern web technologies such as **Node.js**, **React.js**, **MongoDB**, and **FFmpeg** for video processing and streaming.

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Upload Videos**: Users can upload videos in various formats.
- **Stream Videos**: Real-time streaming of videos using HLS (HTTP Live Streaming).
- **Video Playback**: Videos are playable on all devices using HTML5 video player.
- **Responsive Design**: Mobile-friendly and optimized for all screen sizes.
- **Video Transcoding**: Video files are automatically transcoded to streamable formats.
- **Video Search and Filtering**: Users can search for videos by title, category, or user.

## Tech Stack

- **Frontend**: React.js, HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js, MongoDB, JWT for authentication
- **Video Streaming**: FFmpeg, HLS
- **File Storage**: AWS S3 or local storage for video file storage

## Installation

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (for database)
- **FFmpeg** (for video transcoding)
- **AWS Account** (if using S3 for file storage)
  
### Steps to Install

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/video-streaming-platform.git
    ```

2. Navigate to the project folder:
    ```bash
    cd video-streaming-platform
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Configure environment variables:
    - Create a `.env` file in the root directory:
        ```
        MONGODB_URI=<your-mongodb-uri>
        JWT_SECRET=<your-jwt-secret>
        AWS_ACCESS_KEY_ID=<your-aws-access-key>
        AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
        AWS_BUCKET_NAME=<your-aws-s3-bucket-name>
        ```
    
5. Start the server:
    ```bash
    npm start
    ```

6. Run the frontend (React.js):
    ```bash
    cd client
    npm install
    npm start
    ```

## Usage

- **Sign up**: Create a new user account.
- **Login**: Access your account.
- **Upload Video**: Upload videos in formats like MP4, MOV, etc.
- **Watch Videos**: Browse and stream uploaded videos in real-time.
- **Search**: Filter videos by categories, titles, and more.

## Development

### Backend

- The backend is built using **Node.js** and **Express.js**.
- MongoDB is used for database storage.
- Video processing is handled using **FFmpeg** to convert video files into HLS format for adaptive streaming.

### Frontend

- The frontend is built using **React.js**.
- Videos are streamed using the **HTML5 video player** with support for HLS.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit pull requests and contribute to the project! Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) for any contributions.

## Contact

For any queries or feedback, please contact:
- **Your Name**: [your-email@example.com](mailto:your-email@example.com)
- GitHub: [https://github.com/your-username](https://github.com/your-username)
