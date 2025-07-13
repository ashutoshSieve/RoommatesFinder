require("dotenv").config();
const express=require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const User = require("./DataBase");
const { jsonwebtoken, generateJWT } = require("./JwtAuth");
const Message = require("./Message");
const upload = require("./Upload");
const app = express();



app.use(cors({
    origin: ["https://roommatefinder3.netlify.app"],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());


app.get("/verify-token", jsonwebtoken, (req, res) => {
    res.status(200).json({ message: "Token is valid", user: req.payload });
});


app.get("/api/user", jsonwebtoken, async(req, res) =>{
    try {
        const user = await User.findById(req.payload.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({info: user});
    } catch (error) {
        res.status(500).json({ message: "Error in finding profile", error });
    }
});

app.get("/api/user/:id", jsonwebtoken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
});

app.put("/api/userUpdate", jsonwebtoken, upload.single("profileImage"), async (req, res) => {
  try {
    const userId = req.payload.id;
    const {
      city,
      age,
      occupation,
      genderPreference,
      isSmoker,
      roomSharing,
      petsAllowed,
      budgetRange,
      location,
      cleanlinessLevel,
      noiseTolerance,
      foodHabit,
      sleepSchedule
    } = req.body;

    const updateFields = {
      city,
      age,
      occupation,
      profileImage: req.file ? `/uploads/${req.file.filename}` : undefined,
      preferences: {
        genderPreference,
        isSmoker: isSmoker === "true",
        roomSharing: roomSharing === "true",
        petsAllowed: petsAllowed === "true",
        budgetRange,
        location,
        cleanlinessLevel,
        noiseTolerance,
        foodHabit,
        sleepSchedule
      }
    };

    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) delete updateFields[key];
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

app.get("/api/match", jsonwebtoken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.payload.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    const { smoking, gender, city, ageMin, ageMax } = req.query;

    const filters = {
      _id: { $ne: currentUser._id },
    };

    if (gender) filters.gender = gender;
    if (city) filters.city = city;
    if (smoking !== undefined) {
      filters["preferences.smoking"] = smoking === "true";
    }
    if (ageMin || ageMax) {
      filters.age = {};
      if (ageMin) filters.age.$gte = parseInt(ageMin);
      if (ageMax) filters.age.$lte = parseInt(ageMax);
    }

    const allUsers = await User.find(filters);

    const comparePrefs = [
      "sleepSchedule",
      "foodHabit",
      "cleanlinessLevel",
      "noiseTolerance",
      "smoking",
      "petsAllowed",
    ];

    const matchedUsers = allUsers
      .map(user => {
        let matchScore = 0;
        comparePrefs.forEach(key => {
          if (
            user.preferences?.[key] !== undefined &&
            user.preferences?.[key] === currentUser.preferences?.[key]
          ) {
            matchScore++;
          }
        });

        const percentage = Math.round(
          (matchScore / comparePrefs.length) * 100
        );

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          compatibility: percentage,
          gender: user.gender,
          age: user.age,
          location: user.preferences?.location || "",
        };
      });

    matchedUsers.sort((a, b) => b.compatibility - a.compatibility);

    res.status(200).json({ matches: matchedUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error matching users", error: error.message });
  }
});



app.get("/api/chats", jsonwebtoken, async (req, res) => {
  try {
    const myId = req.payload.id;

    const messages = await Message.find({
      $or: [{ sender: myId }, { receiver: myId }],
    }).populate("sender receiver");

    const chatMap = new Map();

    messages.forEach((msg) => {
      const otherUser =
        msg.sender._id.toString() === myId
          ? msg.receiver
          : msg.sender;

      if (!chatMap.has(otherUser._id.toString())) {
        chatMap.set(otherUser._id.toString(), {
          _id: otherUser._id,
          name: otherUser.name,
          profileImage: otherUser.profileImage,
          lastMessage: msg.content,
          lastTimestamp: msg.timestamp,
          unreadCount: 0,
        });
      }

      const current = chatMap.get(otherUser._id.toString());

      if (msg.timestamp > current.lastTimestamp) {
        current.lastMessage = msg.content;
        current.lastTimestamp = msg.timestamp;
      }

      if (!msg.read && msg.sender._id.toString() === otherUser._id.toString()) {
        current.unreadCount += 1;
      }

      chatMap.set(otherUser._id.toString(), current);
    });

    const result = Array.from(chatMap.values()).sort(
      (a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp)
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat history", error: err });
  }
});

app.get("/api/messages/:id", jsonwebtoken, async (req, res) => {
  const otherUserId = req.params.id;
  const myId = req.payload.id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: otherUserId },
        { sender: otherUserId, receiver: myId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages", error: err });
  }
});

app.post("/api/messages", jsonwebtoken, async (req, res) => {
  const senderId = req.payload.id;
  const { receiverId, content } = req.body;

  if (!receiverId || !content) {
    return res.status(400).json({ message: "Receiver ID and content are required" });
  }

  try {
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent", data: newMessage });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
});

app.put("/api/messages/:id/read", jsonwebtoken, async (req, res) => {
  const myId = req.payload.id;
  const otherUserId = req.params.id;

  try {
    await Message.updateMany(
      { sender: otherUserId, receiver: myId, read: false },
      { $set: { read: true } }
    );
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark messages as read", error: err });
  }
});




app.post("/api/signup", async(req, res) =>{
    try {
        const {name, email, password, gender} = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ name, email, password, gender });
        await newUser.save();

        const token = generateJWT({ id: newUser._id, email: newUser.email, name: newUser.name});

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        });

        res.status(201).json({ message: "User created successfully!", token });

    } catch (error) {
        res.status(500).json({ message: "Error creating user", error.message });
    }
});

app.post("/api/login", async(req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        
        if (!user || (password!==user.password)) {
            return res.status(400).json({ message: "Wrong credentials" });
        }

        const token = generateJWT({ id: user._id, name: user.name, email: user.email });
        res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "None" });

        res.status(200).json({ message: "User logged in successfully!", token });

    } catch (error) {
        res.status(500).json({ message: "Error logging in", error.message });
    }
});

app.post("/api/logout", (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
});


const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://roommatefinder3.netlify.app",
    credentials: true,
  },
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    const newMessage = new Message({ sender: senderId, receiver: receiverId, content });
    await newMessage.save();

    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        content,
        timestamp: newMessage.timestamp,
      });
    }
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
