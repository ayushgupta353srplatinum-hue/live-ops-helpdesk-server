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

// Create HTTP Server
const server = http.createServer(app)

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

// In-memory Lock Storage
const lockedTickets = new Map()

// Test Route
app.get("/", (req, res) => {
  res.send("Helpdesk Server Running")
})

// Socket Connection
io.on("connection", (socket) => {

  console.log("User Connected:", socket.id)

  // =========================
  // LOCK TICKET
  // =========================
  socket.on("lock_ticket", ({ ticketId, agentName }) => {

    // Check if already locked
    if (lockedTickets.has(ticketId)) {

      socket.emit("lock_failed", {
        message: "Ticket already locked"
      })

      return
    }

    // Lock Ticket
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

  // =========================
  // UNLOCK TICKET
  // =========================
  socket.on("unlock_ticket", ({ ticketId }) => {

    lockedTickets.delete(ticketId)

    io.emit("ticket_unlocked", {
      ticketId
    })

    console.log(`Ticket ${ticketId} unlocked`)
  })

  // =========================
  // DISCONNECT HANDLER
  // =========================
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