const { Router } = require("express");
const validate = require("../middlewares/validator");
const {
    loginValidationRules,
    registerValidationRules,
    deleteAccountValidationRules,
} = require("../middlewares/validateAuth");
const {
    login,
    register,
    deleteAccount,
} = require("../controllers/authController");

const router = Router();

router.post("/login", loginValidationRules(), validate, login);
router.post("/register", registerValidationRules(), validate, register);
router.delete(
    "/deleteAccount",
    deleteAccountValidationRules(),
    validate,
    deleteAccount
);

module.exports = router;
