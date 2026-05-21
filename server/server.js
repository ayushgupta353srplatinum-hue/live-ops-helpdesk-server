const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")

const ticketRoutes = require("./routes/ticketRoutes")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/tickets", ticketRoutes)

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const lockedTickets = new Map()

app.get("/", (req, res) => {
  res.send("Helpdesk Server Running")
})

io.on("connection", (socket) => {

  console.log("User Connected:", socket.id)

  socket.on("lock_ticket", ({ ticketId, agentName }) => {

    // Check if already locked
    if (lockedTickets.has(ticketId)) {

      socket.emit("lock_failed", {
        message: "Ticket already locked"
      })

      return
    }

    lockedTickets.set(ticketId, {
      socketId: socket.id,
      agentName
    })

    // Broadcast to all users
    io.emit("ticket_locked", {
      ticketId,
      agentName
    })

    console.log(`Ticket ${ticketId} locked by ${agentName}`)
  })

  socket.on("unlock_ticket", ({ ticketId }) => {

    lockedTickets.delete(ticketId)

    io.emit("ticket_unlocked", {
      ticketId
    })

    console.log(`Ticket ${ticketId} unlocked`)
  })

  socket.on("disconnect", () => {

    console.log("User Disconnected:", socket.id)

    // Find locked tickets by disconnected user
    for (const [ticketId, data] of lockedTickets.entries()) {

      if (data.socketId === socket.id) {

        // Remove lock
        lockedTickets.delete(ticketId)

        // Broadcast unlock
        io.emit("ticket_unlocked", {
          ticketId
        })

        console.log(`Ticket ${ticketId} auto unlocked`)
      }
    }
  })
})

// Start Server
server.listen(5000, () => {
  console.log("Server running on port 5000")
})