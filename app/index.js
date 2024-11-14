const express = require('express')
const mysql = require('mysql')
const { geradorNome } = require('gerador-nome')

const app = express()
const port = 3000
let htmlReponse = '';

const connection = mysql.createConnection({
  host: 'database',
  user: 'usr_desafio',
  password: 'usr_desafio',
  database: 'desafio_nginx_node',
})

const managePeople = () => {
  const name = geradorNome();
  const insert = `INSERT INTO people(name) VALUES ('${name}')`
  const select = `SELECT * from people`

  connection.connect((error) => {
    if (error) throw error

    connection.query(insert, (error, result) => {
      if (error) throw error
    })

    connection.query(select, (error, results, fields) => {
      if (error) throw error
      htmlReponse = buildResponse(results)
    })
  })
}

const buildResponse = (results) => {
  let response = '<h1>Full Cycle Rocks!</h1><ul>'

  const listNames = results.reduce(
    (prev, current) => `${prev}<li>${current.id} - ${current.name}</li>`, ''
  )

  response += `${listNames}</ul>`

  return response
}

managePeople()

app.get('/', (req, res) => {
  res.send(htmlReponse)
})

app.listen(port, () => {
  console.log(`On port ${port}`)
})