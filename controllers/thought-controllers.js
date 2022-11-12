const { Thought, User } = require('../models');

const thoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v')
      .sort('-createdAt')
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get a single by _id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v')
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(400).json({ message: 'No thought found with this id.' });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // post new thought
  createThought({ body }, res) {
    Thought.create({ thoughtText: body.thoughtText, username: body.username })
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        ).select('-__v');
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // post create reaction to thought
  createReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { $push: { reactions: body } },
      { new: true }
    )
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(400).json({ message: 'No thought found with this id.' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },

  // put update thought by _id
  updateThoughtById({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.id },
      { thoughtText: body.thoughtText },
      { new: true }
    )
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(400).json({ message: 'No thought found with this id.' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // delete thought by _id
  deleteThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          res.status(400).json({ message: 'No thought found with this id.' });
          return;
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        ).select('-__v');
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(400).json({ message: 'No user found with this id.' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete reaction by reactionId
  deleteReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
    .select('-__v')
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(400).json({ message: 'Incorrect thought or reaction id' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  }
};

module.exports = thoughtController;