const express = require("express");
const app = express();
const { Server } = require("socket.io");
const connectMongoose = require("./db/connectMongoose");
const Book = require("./model/bookModel");
connectMongoose();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const server = app.listen(4000, () => {
  console.log("srver has connected at port no 4000");
});

const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`${socket.id} has connected to server`);
  //create
  socket.on("createBook", async (data) => {
    try {
      console.log("data is ", data);

      const { title, authorName, publishedAt } = data;

      if (data) {
        const response = await Book.create({
          title: title,
          authorName: authorName,
          publishedAt: publishedAt,
        });
        console.log("response is", response);

        if (response) {
          socket.emit("response", {
            status: 200,
            successMesssage: "successfully added item",
            data: response,
          });
        }
      }
    } catch (error) {
      socket.emit("response", {
        status: 500,
        message: "something went wrong",
        data: error?.message,
      });
    }
  });

  //read
  socket.on("readBook", async () => {
    try {
      const response = await Book.find();
      if (response?.length > 0) {
        socket.emit("response", {
          status: true,
          message: "successfully read all the data",
          data: response,
        });
      }
    } catch (error) {
      socket.emit("response", {
        status: 500,
        message: "something went wrong",
        data: error?.message,
      });
    }
  });

  //update
  socket.on("updateBook", async (data) => {
    try {
      const { _id, title } = data;
      if (!_id || !title) {
        return socket.emit("response", {
          status: 400,
          message: "Provide both the title and id to update the book",
        });
      }

      const response = await Book.findByIdAndUpdate(
        _id,
        { title: title },
        { new: true }
      );

      socket.emit("response", {
        status: 200,
        message: "Successfully updated",
        data: response,
      });
    } catch (error) {
      socket.emit("response", {
        status: 500,
        message: "Something went wrong",
        data: error?.message,
      });
    }
  });

  //delete
  socket.on("deleteBook", async (data) => {
    try {
      const { _id } = data;
      if (!_id) {
        return socket.emit("response", {
          status: 400,
          message: "provide the id to delete the book",
        });
      }
      await Book.findByIdAndDelete(_id);
      socket.emit("response", {
        status: 200,
        message: "successfully deleted the book",
      });
    } catch (error) {
      socket.emit("response", { status: 500, message: error?.message });
    }
  });
});
