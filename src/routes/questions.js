const express = require('express');
const router = express.Router();
const questionsController = require('../app/controllers/QuestionsController');

router.get('/create', questionsController.create); //ưu tiên thằng slug hơn nếu k match thì nó sẽ tự chuyển sang con đường chính
router.post('/store', questionsController.store);

router.get('/edit/:id', questionsController.edit);
router.post('/handle-form', questionsController.handleForm);
router.post('/update/:id', questionsController.update); //put
//đúng ra là dùng /:id là đc rồi nhưng do trùng POST vs delete nên lọt vô update thì sẽ k lọt vô delete nx nên thêm update để cho khác nhau

router.post('/:id', questionsController.destroy); //delete
router.post('/force/:id', questionsController.forceDestroy); //delete
router.post('/restore/:id', questionsController.restore); //patch

router.get('/:slug', questionsController.show);

module.exports = router;
