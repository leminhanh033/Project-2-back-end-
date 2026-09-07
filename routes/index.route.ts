import { Router } from 'express';
import employeeRoute from "./employee.route";
import employerRoute from "./employer.route";
import authRoute from "./auth.route";
import jobRoute from "./job.route";
import homeRoute from "./home.route";
import searchRoute from "./search.route";
import companyRoute from "./company.route";
import CVRoute from "./CV.route";
import uploadRoute from "./upload.route";
const router=Router();

router.use("/employee",employeeRoute);
router.use("/employer",employerRoute);
router.use("/auth",authRoute);
router.use("/job",jobRoute);
router.use("/home",homeRoute);
router.use("/search",searchRoute);
router.use("/company",companyRoute);
router.use("/CV",CVRoute);
router.use("/upload",uploadRoute);

export default router;