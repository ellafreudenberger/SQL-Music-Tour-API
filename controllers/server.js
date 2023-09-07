// CONTROLLERS 
const bandsController = require('./controllers/bands_controller'); 
const eventsController = require('./controllers/events_controller'); 
const stagesController = require('./controllers/stages_controller'); 

app.use('/bands', bandsController)
app.use('/events', eventsController)
app.use('/stages', stagesController)