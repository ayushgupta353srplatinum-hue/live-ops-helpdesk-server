const express = require("express")
const router = express.Router()

const tickets = require("../data/tickets")

router.get("/", (req, res) => {
  res.json(tickets)
})

module.exports = router