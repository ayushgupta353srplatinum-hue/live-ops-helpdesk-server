import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import "./App.css"
const socket = io("https://live-ops-helpdesk-server.onrender.com")

function App() {

  const [tickets, setTickets] = useState([])
  const [lockedTickets, setLockedTickets] = useState({})
  const [isDisconnected, setIsDisconnected] = useState(false)
  const [agentName, setAgentName] = useState("")

  useEffect(() => {

    fetch("https://live-ops-helpdesk-server.onrender.com/tickets")
      .then((res) => res.json())
      .then((data) => setTickets(data))

  }, [])

  useEffect(() => {

    // Ticket Locked
    socket.on("ticket_locked", ({ ticketId, agentName }) => {

      setLockedTickets((prev) => ({
        ...prev,
        [ticketId]: agentName
      }))
    })

    // Ticket Unlocked
    socket.on("ticket_unlocked", ({ ticketId }) => {

      setLockedTickets((prev) => {

        const updated = { ...prev }

        delete updated[ticketId]

        return updated
      })
    })

    // Disconnect Banner
    socket.on("disconnect", () => {
      setIsDisconnected(true)
    })

    socket.on("connect", () => {
      setIsDisconnected(false)
    })

    return () => {
      socket.off("ticket_locked")
      socket.off("ticket_unlocked")
      socket.off("disconnect")
      socket.off("connect")
    }

  }, [])

  const handleLock = (ticketId) => {

    if (!agentName) {
      alert("Please enter agent name")
      return
    }

    socket.emit("lock_ticket", {
      ticketId,
      agentName
    })
  }

  const handleUnlock = (ticketId) => {

    socket.emit("unlock_ticket", {
      ticketId
    })
  }

  return (

    <div className="app">

      {/* HEADER */}
      <div className="header">

        <div>
          <h1 className="title">
            Live Ops Helpdesk
          </h1>

          <p className="subtitle">
            Real-Time Ticket Collaboration System
          </p>
        </div>

        <input
          type="text"
          placeholder="Enter Agent Name"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="agent-input"
        />

      </div>

      {/* DISCONNECT BANNER */}
      {
        isDisconnected && (
          <div className="disconnect-banner">
            Connection Lost : Reconnecting...
          </div>
        )
      }

      {/* TICKET GRID */}
      <div className="ticket-grid">

        {
          tickets.map((ticket) => {

            const lockedBy = lockedTickets[ticket.id]

            const isLocked = !!lockedBy

            const isMyLock = lockedBy === agentName

            return (

              <div
                key={ticket.id}
                className={`ticket-card ${isLocked ? "ticket-locked" : ""}`}
              >

                {/* TOP SECTION */}
                <div className="ticket-top">

                  <div>

                    <h2 className="ticket-id">
                      #{ticket.id}
                    </h2>

                    <p className="ticket-title">
                      {ticket.title}
                    </p>

                  </div>

                  <div className="ticket-status">
                    {ticket.status}
                  </div>

                </div>

                {/* LOCK INFO */}
                {
                  isLocked && (
                    <div className="lock-info">
                       Locked by {lockedBy}
                    </div>
                  )
                }

                {/* BUTTONS */}
                <div className="button-group">

                  {
                    !isLocked && (
                      <button
                        onClick={() => handleLock(ticket.id)}
                        className="edit-btn"
                      >
                        Edit Ticket
                      </button>
                    )
                  }

                  {
                    isMyLock && (
                      <button
                        onClick={() => handleUnlock(ticket.id)}
                        className="unlock-btn"
                      >
                        Save & Unlock
                      </button>
                    )
                  }

                </div>

              </div>
            )
          })
        }

      </div>

    </div>
  )
}

export default App