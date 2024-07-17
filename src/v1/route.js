const { isAuthenticated } = require("../middleware/index");
const authenticationRoute = require("./auth/router");
const profile = require("./user/profile/route");
const feedbackRoute = require("./feedback/route");
const notificationRoute = require("./notifications/route");
const faqRoute = require("./common/faq/route");
const chatRouter = require("./chat/route");
const quoteRoute = require("./quote/route");
const postRouter = require("./post/route");
const restaurantRoute = require("./admin/restaurant/route");
const menuRoute = require("./admin/menu/route");
const ticketRoute = require("./admin/support/router");
const router = require("express").Router();

router.get("/health", (req, res) => {
    return res.json({
        "status": 200,
        "timestamp": "09-05",
    });
});

router.use("/", authenticationRoute);
router.use("/", isAuthenticated, profile);
router.use("/", isAuthenticated, feedbackRoute);
router.use("/", isAuthenticated, notificationRoute);
router.use("/", isAuthenticated, faqRoute);
router.use("/", isAuthenticated, chatRouter);
router.use("/", isAuthenticated, quoteRoute);
router.use("/", isAuthenticated, postRouter);


// admin included 
router.use("/", isAuthenticated, restaurantRoute);
router.use("/", isAuthenticated, menuRoute);
router.use("/", isAuthenticated, ticketRoute);



module.exports = router;
