import { jsonResponse } from "../lib/jsonResponse.mjs";
import express from "express";
const router = express.Router();

router.get("/",(req, res)=>{
    res.status(200).json(jsonResponse(200, req.user))

});

export default  router;