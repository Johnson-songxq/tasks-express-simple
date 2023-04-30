// https://lazebear.github.io/jr-todos/
const express = require("express");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //wildcard
  // res.setHeader('Access-Control-Allow-Origin', 'https://lazebear.github.io'); // wildcard
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");

  next();
});

app.use(express.json());

const tasks = [
  {
    id: 1,
    description: "task 1",
    done: false,
  },
];
let id = 1; //self increase

app.get("/tasks", (req, res) => {
  //不用关心我们不关心的字段
  // if (Object.keys(req.query).length === 0) {
  //   res.status(200).json(tasks);
  //   return;
  // }

  const { description } = req.query;
  if (description) {
    const filteredTasks = tasks.filter((task) =>
      task.description.includes(description)
    );
    res.json(filteredTasks);
    //没有搜到也不返回错误，返回空就可以。
    return;
  }

  res.json(tasks);
  return;
});

app.get("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);
  //不用判断id不存在，不存在的话，根本进入不了这里

  if (!(Number.isInteger(numericId) && numericId > 0)) {
    //refined
    res.status(404).json({ error: "invalid id!" });
    return;
  }

  const taskFound = tasks.find((task) => task.id === numericId);
  if (!taskFound) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  res.status(200).json(taskFound);
  return; //if there is no return, it is same since by default it is undefined returned.
});

app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { description, done } = req.body;
  if (!(Number.isInteger(numericId) && numericId > 0)) {
    //refined
    res.status(404).json({ error: "invalid id!" });
    return;
  }

  //data validation
  //Check existence
  //check type
  //如果字段多的话，就很难这么判断了
  //如果打算把description置为空的话，这么写就不行了。
  if (!description && done !== true && done !== false) {
    res.status(400).json({ error: "Please modify your put body" });
    return;
  }

  let taskFound = tasks.find((task) => task.id === Number(id));
  if (!taskFound) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  //   if (description) {
  //     taskFound.description = description;
  //     if (done === true || done === false) {
  //       taskFound.done = done;
  //     }
  //   } else {
  //     taskFound.done = done;
  //   }

  taskFound.description = description ?? taskFound.description;
  if (done === true || done === false) {
    taskFound.done = done;
  }

  res.status(200).json(taskFound);
  return;
});

app.post("/tasks", (req, res) => {
  const { description } = req.body;
  if (!description) {
    res.status(400).json({ error: "invalid body" });
    return;
  }

  //   const index = tasks.findIndex(
  //     (task) => task.description === req.body.description
  //   );
  //   if (index >= 0) {
  //     res.status(409).json("task already existing");
  //     return;
  //   }

  const taskNew = { id: ++id, description, done: false };
  tasks.push(taskNew);
  res.status(201).json(taskNew);
  return;
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const numericId = Number(id);

  if (!(Number.isInteger(numericId) && numericId > 0)) {
    //refined
    res.status(404).json({ error: "invalid id!" });
    return;
  }

  const index = tasks.findIndex((task) => task.id === Number(id));
  if (index < 0) {
    res.status(404).json({ error: "task not found" });
    return;
  }

  tasks.splice(index, 1);
  res.sendStatus(204); //No content 如果设为204，即使response的body有值也会被忽略掉。
});

app.listen(3000, (err) => {
  if (err) console.log(err);
  console.log("server listening on port 3000");
});
