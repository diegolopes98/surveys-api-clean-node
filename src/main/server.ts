import express from 'express'

const PORT = 5050

const app = express()

app.listen(PORT, () => console.log('server running at http://localhost:5050'))
