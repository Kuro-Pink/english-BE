const express = require('express');
const router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.get('/:slug', newsController.show); //ưu tiên thằng slug hơn nếu k match thì nó sẽ tự chuyển sang con đường chính
router.get('/', newsController.index);

module.exports = router;
