const { Thought } = require('../models');

module.exports = {
    // get all users
    getThoughts(req, res) {
        Thought.find()
            .populate('reactions')
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // get a single user
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought with that ID' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create user
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => res.json(thought))
            .catch((err) => res.status(500).json(err));
    },
    // update user
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // delete thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought with that ID' }) : Thought.deleteMany({ _id: { $in: thought.reactions } })
            )
            .then(() => res.json({ message: 'deleted' }))
            .catch((err) => res.status(500).json(err));
    },

    addReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $push: { reactions: req.body } }, { runValidators: true, new: true })
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought)
            )
            .then(() => res.json({ message: 'reaction created' }))
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $pull: { reactions: { reactionId: req.params.reactionId } } }, { runValidators: true, new: true })
            .then((thought) =>
                !thought ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought)
            )
            .then(() => res.json({ message: 'reaction deleted' }))
            .catch((err) => res.status(500).json(err));
    }
};

