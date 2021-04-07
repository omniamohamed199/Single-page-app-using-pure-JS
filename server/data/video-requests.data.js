var VideoRequest = require('./../models/video-requests.model');
const User = require('./../models/user.model')
module.exports = {
  createRequest: async (vidRequestData) => {
    if (vidRequestData.author_id) {
      const userObj = await User.findOne({ _id: vidRequestData.author_id })
      vidRequestData.author_name = userObj.author_name
      vidRequestData.author_email = userObj.author_email
    }
    let newRequest = new VideoRequest(vidRequestData);
    return newRequest.save();
  },

  getAllVideoRequests: (filterBy) => {
    const filter= filterBy ==='all' ? {} : {status : filterBy}
    return VideoRequest.find(filter).sort({ submit_date: '-1' });
  },

  searchRequests: (topic, filterBy) => {
    const filter= filterBy ==='all' ? {} : {status : filterBy}
    return VideoRequest.find({ topic_title: { $regex: topic, $options: 'i' } , ...filter})
      .sort({ addedAt: '-1' })
  },

  getRequestById: (id) => {
    return VideoRequest.findById({ _id: id });
  },

  updateRequest: (id, status, resVideo) => {
    const updates = {
      status: status,
      video_ref: {
        link: resVideo,
        date: resVideo && new Date(),
      },
    };

    return VideoRequest.findByIdAndUpdate(id, updates, { new: true });
  },

  updateVoteForRequest: async (id, vote_type, user_id) => {
    const oldRequest = await VideoRequest.findById({ _id: id });
    const other_type = vote_type === 'ups' ? 'downs' : 'ups';
    const oldvoteList = oldRequest.votes[vote_type]
    const othervoteList = oldRequest.votes[other_type]

    if (!oldvoteList.includes(user_id)) {
      oldvoteList.push(user_id)
    }
    else {
      oldvoteList.splice(user_id)
    }

    if (othervoteList.includes(user_id)) {
      othervoteList.splice(user_id)
    }
    return VideoRequest.findByIdAndUpdate(
      { _id: id },
      {
        votes: {
          [vote_type]: oldvoteList,
          [other_type]: othervoteList,
        },
      },
      { new: true }
    );
  },
  deleteRequest: (id) => {
    return VideoRequest.deleteOne({ _id: id });
  },
};
