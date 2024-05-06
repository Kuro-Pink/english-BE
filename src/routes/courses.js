const express = require('express');
const router = express.Router();
const coursesController = require('../app/controllers/CoursesController');

router.get('/create', coursesController.create); //ưu tiên thằng slug hơn nếu k match thì nó sẽ tự chuyển sang con đường chính
router.post('/store', coursesController.store);

router.get('/edit/:id', coursesController.edit);
router.post('/handle-form', coursesController.handleForm);
router.post('/update/:id', coursesController.update); //put
//đúng ra là dùng /:id là đc rồi nhưng do trùng POST vs delete nên lọt vô update thì sẽ k lọt vô delete nx nên thêm update để cho khác nhau

router.post('/:id', coursesController.destroy); //delete
router.post('/force/:id', coursesController.forceDestroy); //delete
router.post('/restore/:id', coursesController.restore); //patch

router.get('/:slug', coursesController.show);

module.exports = router;
