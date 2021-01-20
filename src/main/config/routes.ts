import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${__dirname}/../routes/`).map(async routeFolder => {
    readdirSync(`${__dirname}/../routes/${routeFolder}`).map(async file => {
      if (!file.includes('.test.') && !file.includes('.spec.')) {
        (await import(`../routes/${routeFolder}/${file}`)).default(router)
      }
    })
  })
}
