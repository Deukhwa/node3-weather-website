const path = require('path')
const express = require('express')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geoCode = require('./utils/geocode.js')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialPath = path.join(__dirname, '../templates/partials')

// Setup handlerbars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Setup static directory server
app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Deukhwa',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About me',
    name: 'Deukhwa',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    message: 'HELP!!',
    title: 'Help',
    name: 'Deukhwa',
  })
})

app.get('/weather', (req, res) => {
  const address = req.query.address
  if (!address) {
    return res.send({
      error: 'You must provide an address',
    })
  }

  geoCode(address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error })
    }
    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error })
      }

      res.send({
        location,
        forecast: forecastData,
        address,
      })
    })
  })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    })
  }

  res.send({
    products: [],
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404 Help Page',
    name: 'Deukhwa',
    errorMessage: 'Help Article not found',
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Deukhwa',
    errorMessage: 'Page not found',
  })
})

app.listen(3000, () => {
  console.log('Server is up on port 3000')
})
