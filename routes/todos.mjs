import express from "express";
const router = express.Router();
import Todo from "../schema/todo.mjs";


router.get("/",async (req, res)=>{
    try {
        const todos = await Todo.find({isUser: req.user.id});
        if(todos){
            res.json(todos);
        }else{
            res.status(404).json({errer:"todos no encontrados"})
        }
    } catch (error) {
        
    }

});

router.post("/",(req, res)=>{
    if(!req.body.title){
        res.status(400).json({error: "Se requiere titulo"})
    }

    try {
        const todo = new Todo({
            title: req.body.title ,
            completed: false,
            isUser: req.user.id,

        });
        const newTodo = todo.save();

        res.json(newTodo);

    } catch (error) {
        console.log(error)
    }

});

export default router;