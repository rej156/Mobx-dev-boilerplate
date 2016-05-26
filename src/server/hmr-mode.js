import feathers from 'feathers'
import rest from 'feathers-rest'
import compression from 'compression'
import serveStaticMiddleware from './middleware/serve-static'
import cors from 'cors'
import bodyParser from 'body-parser'
import services from './services/index.js'

const app = feathers()

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .options('*', cors())
  .use(cors())
  .use(compression())
  .set('view engine', 'ejs')
  .configure(rest())
  .configure(serveStaticMiddleware)
  .use('/api', services)
  .use((req, res) => require('./middleware/isomorphic.js').default(req, res))

export default app
