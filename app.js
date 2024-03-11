const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const databasePath = path.join(__dirname, 'cricketTeam.db')

app.use(express.json())
let db = null
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => console.log('success'))
  } catch (e) {
    console.log(`DB error ${e.message}`)
    process.exit(1)
  }
}
initializeDbAndServer()

const hasStatus = query => {
  return query.status !== undefined
}

const convertToResponseOb = requestQuery => {
  return {
    id: requestQuery.id,
    todo: requestQuery.todo,
    priority: requestQuery.priority,
    status: requestQuery.status,
    category: requestQuery.category,
    dueDate: requestQuery.due_date,
  }
}

app.get('/todos/', async (request, response) => {
  let getQuery = ''
  let data = null
  const {search_q = '', priority, status, category} = request.query
  switch (true) {
    case hasStatus(request.query):
      if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
        getQuery = `SELECT * FROM todo WHERE status='${status}';`
        data = await db.all(getQuery)
        response.send(data.map(eachItem => convertToResponseOb(eachItem)))
      } else {
        response.status(400)
        response.send('Invalid Todo Status')
      }
      break
    default:
      getQuery = `SELECT * FROM todo;`
      data = await db.all(getQuery)
      response.send(data.map(eachItem => convertToResponseOb(eachItem)))
  }
})

module.exports = app
