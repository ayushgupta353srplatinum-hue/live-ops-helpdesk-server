#  Live Ops Helpdesk

A real-time collaborative support ticket management system built using React, Node.js, Express, and Socket.io to solve concurrency issues and race conditions in multi-agent environments.

---

#  Project Overview

RapidDispatch Freight & Logistics handles thousands of support tickets daily.  
This project was built to prevent multiple support agents from editing the same ticket simultaneously.

The application uses WebSockets (Socket.io) for real-time communication and implements a ticket locking system with automatic recovery from unexpected disconnects.

---

#  Features

##  Real-Time Ticket Locking

- Only one agent can edit a ticket at a time
- Prevents race conditions and data overwrites
- Lock status updates instantly across all connected clients

---

##  Live Synchronization

- Real-time updates using Socket.io
- No page refresh required
- All clients stay synchronized instantly

---

##  Ghost Disconnect Recovery

If an agent disconnects unexpectedly:

- Ticket locks are automatically released
- Other agents can continue working immediately
- Prevents permanently locked tickets

---

##  Professional Dashboard UI

- Responsive dark theme UI
- Black & yellow enterprise dashboard design
- Compact professional ticket cards
- Real-time status indicators

---

##  Connection Monitoring

- Detects socket disconnections
- Displays:

```txt
Connection Lost: Reconnecting...
```

- Helps users understand network status

---

#  Core Concepts Implemented

- WebSockets
- Socket.io
- Concurrency Handling
- Race Condition Prevention
- Real-Time State Synchronization
- In-Memory Lock Management
- Disconnect Event Recovery
- Full Stack Deployment

---

#  Tech Stack

## Frontend

- React.js
- Socket.io Client
- CSS3

## Backend

- Node.js
- Express.js
- Socket.io

## Deployment

- Vercel (Frontend)
- Render (Backend)

---

#  Project Structure

```txt
live-ops-helpdesk/

├── live-ops-helpdesk-client/
│   ├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx

├── live-ops-helpdesk-server/
│   ├── routes/
│   ├── data/
│   ├── server.js
│   └── package.json
```

---

#  Installation & Setup

## 1️ Clone Repository

```bash
git clone https://github.com/ayushgupta353srplatinum-hue/live-ops-helpdesk-server.git
```

---

## 2️ Backend Setup

```bash
cd live-ops-helpdesk-server
npm install
node server.js
```

### Backend runs on:

```bash
http://localhost:5000
```

---

## 3️ Frontend Setup

```bash
cd live-ops-helpdesk-client
npm install
npm run dev
```

### Frontend runs on:

```bash
http://localhost:5173
```

---

#  Socket Events

| Event | Description |
|------|-------------|
| lock_ticket | Locks a ticket |
| unlock_ticket | Unlocks a ticket |
| ticket_locked | Broadcasts lock state |
| ticket_unlocked | Broadcasts unlock state |
| disconnect | Handles ghost disconnects |

---

#  In-Memory Lock System

The backend uses a JavaScript `Map()` to store active ticket locks.

Example:

```js
const lockedTickets = new Map()
```

Each lock stores:

- Ticket ID
- Agent Name
- Socket ID

---

#  Ghost Disconnect Handler

When a user closes the tab or loses internet unexpectedly:

```js
socket.on("disconnect", () => {
  // unlock tickets automatically
})
```

### The server automatically:

- Finds locked tickets
- Removes stale locks
- Broadcasts unlock updates to all clients

---

#  Live Deployment

## Frontend

[Add your Vercel URL here](https://live-ops-helpdesk-server.vercel.app/)

## Backend

[https://live-ops-helpdesk-server.onrender.com](https://live-ops-helpdesk-server.onrender.com)

---

#  Demo Features

✔ Real-time ticket locking  
✔ Instant UI synchronization  
✔ Auto unlock on disconnect  
✔ Concurrent editing prevention  

---

#  Recommended Demo

Open two browser windows:

- Agent A
- Agent B

Demonstrate:

1. Ticket locking
2. Real-time synchronization
3. Unlocking
4. Ghost disconnect recovery

---

#  AI Assistance Transparency

AI tools were used for:

- Debugging Socket.io issues
- React Strict Mode troubleshooting
- UI enhancement suggestions
- Real-time synchronization logic guidance

---

#  Future Improvements

- Authentication system
- Persistent database integration
- Role-based access
- Ticket chat system
- Activity logs
- Typing indicators
- Notification system

---

#  Conclusion

This project demonstrates how modern collaborative systems prevent race conditions using real-time WebSocket communication and intelligent server-side lock management.

It simulates real-world enterprise helpdesk workflows used in large-scale logistics and operations environments.
