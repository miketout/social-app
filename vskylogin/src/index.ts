import cors from 'cors'
import express from 'express'

const app = express()
app.use(express.json())
app.use(cors())

const port = 21001

let lastLogin: any

app.post('/confirm-login', async req => {
  lastLogin = req.body
  console.log(lastLogin)
})

app.get('/get-login', async (_, res) => {
  console.log(lastLogin)
  if (!lastLogin) {
    res.status(204).send('No login received.')
  } else {
    res.status(200).json(lastLogin)
    // Clean up the last login after relaying it.
    lastLogin = null
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
