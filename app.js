"use strict";
// importing module
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require("mongoose");
// init
const app = express();
const port = "3000" || process.env.PORT;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose
mongoose.connect("mongodb://127.0.0.1:27017/newToDoList");
const itemSchema = new mongoose.Schema({
  tasksName: {
    type: String,
    required: true,
  },
});
const listsSchema = new mongoose.Schema({
  listName: {
    type: String,
    required: true,
  },
  formatedListName: {
    type: String,
    required: true,
  },
  tasks: [],
});
const List = new mongoose.model("List", listsSchema);
const initList = new List({
  listName: "To do list",
  formatedListName: "to-do-list",
  tasks: ["welcome"],
});
const defaultList = [initList];

// app
app.get("/", function (req, res) {
  List.find()
    .then((allL) => {
      if (allL.length === 0) {
        List.insertMany(defaultList)
          .then((e) => {
            console.log(e);
            console.log("Succesfully inserted");
          })
          .catch((err) => {
            console.log("error", err);
          });
        res.redirect("/");
      } else {
        console.log("loading data");
        const currentList = allL[allL.length - 1];
        List.find({}, { _id: 0, formatedListName: 1 }).then((allLinks) => {
          console.log("all links -->", allLinks);
          res.render("pages/list", {
            currentList: currentList,
            allLists: allL,
            listLink: allLinks,
            currentLink: currentList.formatedListName,
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customlistName", function (req, res) {
  const customListName = _.kebabCase(_.toLower(req.params.customlistName));
  List.find({ formatedListName: customListName }).then((resultedLists) => {
    if (resultedLists.length >= 1) {
      const currentList = resultedLists[0];
      List.find().then((allL) => {
        List.find({}, { _id: 0, formatedListName: 1 }).then((allLinks) => {
          res.render("pages/list", {
            currentList: currentList,
            allLists: allL,
            listLink: allLinks,
            currentLink: currentList.formatedListName,
          });
        });
      });
    } else {
      res.send("<h1>Page not found, 404</h1>");
    }
  });
});
app.post("/createList", function (req, res) {
  const newListName = _.capitalize(_.toLower(req.body.newList));
  const kebabCaseListName = _.kebabCase(newListName);
  List.find({ formatedListName: kebabCaseListName }).then((resultedLists) => {
    if (resultedLists.length > 0) {
      console.log("already exists", resultedLists);
      res.redirect(`/${kebabCaseListName}`);
    } else {
      const newList = new List({
        listName: newListName,
        formatedListName: kebabCaseListName,
        tasks: [],
      });
      newList
        .save()
        .then((savedNewList) => {
          console.log("new list added -->", savedNewList);
          res.redirect(`/${kebabCaseListName}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});
app.post("/deleteTask", function (req, res) {
  const checkedItemIndex = req.body.checkbox;
  const listN = _.kebabCase(req.body.listName);
  List.find({ formatedListName: listN }).then((currentList) => {
    console.log("Current List -->", currentList);
    const updatedtasks = currentList[0].tasks;
    updatedtasks.splice(checkedItemIndex, 1);
    List.updateOne({ formatedListName: listN }, { tasks: updatedtasks })
      .then((result) => {
        console.log(result);
        setTimeout(() => {
          res.redirect(`/${listN}`);
        }, 100);
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post("/:customListName", function (req, res) {
  const currentListName = req.params.customListName;
  const newTask = req.body.newTask;
  console.log(currentListName);
  List.find({ formatedListName: currentListName })
    .then((currentList) => {
      const currentListTasks = currentList[0].tasks;
      console.log(currentListTasks);
      currentListTasks.unshift(newTask);
      console.log(currentListTasks);
      List.updateOne(
        { formatedListName: currentListName },
        { tasks: currentListTasks }
      )
        .then((result) => {
          console.log(result);
          res.redirect(`/${currentListName}`);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});
/*
app.get("/", function (req, res) {
  res.render("pages/list", {
    currentList: lists[lists.length - 1],
    allLists: lists,
    listLink: nameList,
    currentLink: nameList[lists.length - 1],
  });
});

app.post("/", function (req, res) {
  lists[lists.length - 1].tasks.unshift(req.body.newTask);
  res.redirect("/");
});

app.post("/createList", function (req, res) {
  const newListName = _.capitalize(_.toLower(req.body.newList));
  const kebabCaseListName = _.kebabCase(newListName);
  let contains;
  for (let i = 0; i < lists.length; i++) {
    if (nameList[i] === kebabCaseListName) {
      contains = true;
    }
  }
  if (contains) {
    contains = false;
    console.log("already exist", kebabCaseListName);
    res.redirect(`/${kebabCaseListName}`);
  } else {
    nameList.unshift(_.kebabCase(newListName));
    const newListObj = {
      listName: newListName,
      tasks: [],
    };
    lists.unshift(newListObj);
    res.redirect(`/${kebabCaseListName}`);
  }
});

app.get(`/:customList`, function (req, res) {
  const customListName = _.kebabCase(_.toLower(req.params.customList));
  const customListIndex = nameList.indexOf(customListName);
  nameList.forEach(function (list) {
    if (list === customListName) {
      console.log("loading list");
      res.render("pages/list", {
        currentList: lists[customListIndex],
        allLists: lists,
        listLink: nameList,
        currentLink: nameList[customListIndex],
      });
    } else {
    }
  });
});

app.post("/deleteTask", function (req, res) {
  const checkedItemIndex = req.body.checkbox;
  const listN = _.kebabCase(req.body.listName);
  const listIndex = nameList.indexOf(listN);
  if (checkedItemIndex > -1) {
    lists[listIndex].tasks.splice(checkedItemIndex, 1);
  }
  setTimeout(() => {
    res.redirect(`/${listN}`);
  }, 100);
});

app.post("/:customList", function (req, res) {
  const customListName = req.params.customList;

  if (!(customListName === "deleteTask")) {
    const customListIndex = nameList.indexOf(customListName);
    lists[customListIndex].tasks.unshift(req.body.newTask);
    res.redirect(`/${customListName}`);
  }
});

*/
app.listen(port, function () {
  console.log(`server is running on port port`);
});
