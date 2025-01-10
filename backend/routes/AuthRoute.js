const { Signup, Login, submitQuiz } = require('../controllers/AuthController');
const { userVerification } = require('../middlewares/AuthMiddleware');
const router = require('express').Router();

router.post('/', userVerification);
router.post('/signup', Signup);
router.post('/login', Login);
router.post('/submit-quiz', submitQuiz);

module.exports = router;