import { Router } from "express";
import AuthRouter from "./authentication/auth.routes";
import FlightScheduleRouter from "./flight_schedule/flight_schedule.routes";
import FlightBookingRouter from "./booking/booking.routes"
import GalleryRouter from "./gallery/gallery.routes";
import TeamRouter from "./team/team.routes";
import ContactRouter from "./contact/contact.routes";
import InquiryRouter from "./inquiry/inquiry.routes";
import NewsLetterRouter from "./news_letter/news_letter.routes";
import PackageRouter from "./package/package.routes";
import ReplyRouter from "./reply/reply.routes";
import SeoRouter from "./seo/seo.routes";
import SeoMetaRouter from "./seo_meta_data/seo_meta_data";
import AnalyticsRouter from "./analytics/analytics.routes";
import LogoutRouter from "./logout/logout.routes";


const router = Router();

router.use("/auth", AuthRouter);
router.use("/flight-schedule", FlightScheduleRouter);
router.use('/flight-booking', FlightBookingRouter)
router.use("/gallery", GalleryRouter);
router.use("/team", TeamRouter);
router.use("/contact", ContactRouter);
router.use("/inquiry", InquiryRouter);
router.use("/news-letter", NewsLetterRouter);
router.use("/package", PackageRouter);
router.use("/reply", ReplyRouter);
router.use("/seo", SeoRouter);
router.use("/seo-meta", SeoMetaRouter);
router.use("/analytics", AnalyticsRouter);
router.use("/logout", LogoutRouter);

export default router;
