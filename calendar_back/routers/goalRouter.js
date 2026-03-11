const express = require("express");
const router = express.Router();
const {getGoalCat, getGoalDesc, createGoalCat, editGoalCat, deleteGoalCat, createGoalDesc, editGoalDesc, deleteGoalDesc} = require("../controllers/goalController");

router.use(express.json());

router.post("/getGoalCat", async (req, res) => {
    const {user_id} = req.body;
    const goalCat = await getGoalCat(user_id);
    res.json(goalCat);
});

router.post("/getGoalDesc", async (req, res) => {
    const {goal_id} = req.body;
    const goalDesc = await getGoalDesc(goal_id);
    res.json(goalDesc);
});

router.post("/createGoalCat", async (req, res) => {
    const {user_id, name, description} = req.body;
    const goalCatCreate = await createGoalCat(user_id, name, description);
    res.json(goalCatCreate);
});

router.post("/editGoalCat", async (req, res) => {
    const {goal_id, name, description} = req.body;
    const goalCatEdit = await editGoalCat(goal_id, name, description);
    res.json(goalCatEdit);
});

router.post("/deleteGoalCat", async (req, res) => {
    const {goal_id} = req.body;
    const goalCatDelete = await deleteGoalCat(goal_id);
    res.json(goalCatDelete);
});

router.post("/createGoalDesc", async (req, res) => {
    const {goal_id, name, description} = req.body;
    const goalDescCreate = await createGoalDesc(goal_id, name, description);
    res.json(goalDescCreate);
});

router.post("/editGoalDesc", async (req, res) => {
    const {id, name, description, completed} = req.body;
    const goalDescEdit = await editGoalDesc(id, name, description, completed);
    res.json(goalDescEdit);
});

router.post("/deleteGoalDesc", async (req, res) => {
    const {id} = req.body;
    const goalDescDelete = await deleteGoalDesc(id);
    res.json(goalDescDelete);
});

module.exports = router;