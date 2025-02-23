const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/stored/courses', meController.storedCourses);
router.get('/trash/courses', meController.trashCourses);

router.get('/stored/questions', meController.storedQuestions);
router.get('/trash/questions', meController.trashQuestions);

module.exports = router;
