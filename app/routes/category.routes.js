module.exports = (app) => {
    const categories = require('../controllers/category.controller.js');

    // Create a new category
    app.post('/categories', categories.create);

    // Retrieve all categories
    app.get('/categories', categories.findAll);

    // Retrieve a single categories with categoryId
    app.get('/categories/:categoryId', categories.findOne);

    // Update a categories with categoryId
    app.put('/categories/:categoryId', categories.update);

    app.put('/categories/deletenote/:categoryId', categories.updateCategoryOnNoteDelete);

    // Delete a categories with categoryId
    app.delete('/categories/:categoryId', categories.delete);
}
