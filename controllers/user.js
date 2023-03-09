const { User, Thought } = require('../models');

module.exports = {
    // get all users
    getUsers(req, res) {
        User.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create user
    createUser(req, res) {
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // remove user
    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with that ID' }) : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'deleted' }))
            .catch((err) => res.status(500).json(err));
    },
    // add new friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with this ID' }) : res.status(200).json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // remove a friend 
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
};