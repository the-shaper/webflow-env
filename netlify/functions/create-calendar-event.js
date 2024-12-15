const { google } = require('googleapis')

exports.handler = async (event) => {
  console.log('Function invoked')

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod)
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    console.log('Raw event body:', event.body)
    const formData = JSON.parse(event.body)
    console.log('Parsed form data:', formData)

    const { clientName, serviceName, partnerName, clientEmail, eventDate } =
      formData

    // Configure auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_id: process.env.CAL_API_TEST,
        client_secret: process.env.CAL_API_SECRET,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    // Create event
    const calendarEvent = {
      summary: `Wedding: ${clientName} & ${partnerName}`,
      description: `Service: ${serviceName}\nClient Email: ${clientEmail}`,
      start: {
        date: eventDate,
        timeZone: 'America/Mexico_City',
      },
      end: {
        date: eventDate,
        timeZone: 'America/Mexico_City',
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.CAL_ID,
      resource: calendarEvent,
    })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Event created successfully',
        eventId: response.data.id,
      }),
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating calendar event',
        error: error.message,
      }),
    }
  }
}
