const express = require("express");
const router = express.Router();
const {getName, getInfo, deleteUser} = require("../controllers/mainController");

router.use(express.json());

router.post("/getName", async (req, res) => {
    const {id} = req.body;
    const userData = await getName(id);
    res.json(userData);
});

router.post("/getUserInfo", async(req, res) => {
    const {id} = req.body;
    const userData = await getInfo(id);
    res.json(userData);
})

router.delete("/delete", async(req, res) => {
    const {id} = req.body;
    const deletion = await deleteUser(id);
    if (deletion) { 
        res.sendStatus(204); 
    }
    else res.sendStatus(404);
})

module.exports = router;
