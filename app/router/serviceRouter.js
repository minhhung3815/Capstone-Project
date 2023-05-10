const express = require("express");
const service = require("../controller/serviceController");
const router = express.Router();

router.get("/all", service.GetAllServices);

router.get("/specific/:id", service.GetSpecificService);

router.post("/new", service.CreateNewService);

router.put("/update", service.UpdateService);

router.delete("/delete", service.DeleteService);

module.exports = router;
