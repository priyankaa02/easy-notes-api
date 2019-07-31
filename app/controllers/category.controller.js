const Category = require('../models/category.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate request
    if(!req.body.name) {
        return res.status(400).send({
            message: "name can not be empty"
        });
    }

    // Create a Note
    const category = new Category({
        name: req.body.name,
        notes: req.body.notes || []
    });

    Category.find({name : req.body.name}).exec(function(err, docs) {
    if (docs.length){
      return res.status(500).send({
          message: "Name already exists"
      });
    } else {
      category.save()
      .then(data => {
          res.send(data);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while creating the category."
          });
      });
    }
  });
    // Save Note in the database
    // category.save()
    // .then(data => {
    //     res.send(data);
    // }).catch(err => {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating the category."
    //     });
    // });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Category.find()
    .then(categories => {
        res.send(categories);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving categories."
        });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {
  Category.findById(req.params.categoryId)
    .then(category => {
        if(!category) {
            return res.status(404).send({
                message: "Note not found with id " + req.params.noteId
            });
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "category not found with id " + req.params.categoryId
            });
        }
        return res.status(500).send({
            message: "Error retrieving category with id " + req.params.categoryId
        });
    });
};

exports.update = (req, res) => {
  if(!req.body.noteId) {
        return res.status(400).send({
            message: "category content can not be empty"
        });
    }

    // Find note and update it with the request body
    Category.findByIdAndUpdate(req.params.categoryId, {
        name: req.body.name,
        $addToSet: { notes: req.body.noteId  }
    }, {new: true})
    .then(category => {
        if(!category) {
            return res.status(404).send({
                message: "category not found with id " + req.params.categoryId
            });
        }
        res.send(category);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "category not found with id " + req.params.categoryId
            });
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.categoryId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Category.findByIdAndRemove(req.params.categoryId)
    .then(category => {
        if(!category) {
            return res.status(404).send({
                message: "category not found with id " + req.params.categoryId
            });
        }
        res.send({message: "category deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "category not found with id " + req.params.categoryId
            });
        }
        return res.status(500).send({
            message: "Could not delete category with id " + req.params.categoryId
        });
    });
};

exports.updateCategoryOnNoteDelete = (req, res) => {
  Category.findByIdAndUpdate(req.params.categoryId, {
      $pull: { notes: req.body.noteId }
  }, {new: true})
  .then(category => {
      if(!category) {
          return res.status(404).send({
              message: "category not found with id " + req.params.categoryId
          });
      }
      res.send(category);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "category not found with id " + req.params.categoryId
          });
      }
      return res.status(500).send({
          message: "Error updating note with id " + req.params.categoryId
      });
  });
};
