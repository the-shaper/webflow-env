const { google } = require('googleapis')

exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*', // Be more restrictive in production
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod)
    return {
      statusCode: 405,
      headers,
      body: 'Method Not Allowed',
    }
  }

  try {
    console.log('Raw event body:', event.body)
    const formData = JSON.parse(event.body)
    console.log('Parsed form data:', formData)

    // Log environment variables early
    console.log('Environment variables:', {
      hasClientId: !!process.env.CAL_API_TEST,
      hasClientSecret: !!process.env.CAL_API_SECRET,
      hasCalendarId: !!process.env.CAL_ID,
    })

    const { clientName, serviceName, partnerName, clientEmail, eventDate } =
      formData

    // Validate required environment variables
    if (
      !process.env.CAL_API_TEST ||
      !process.env.CAL_API_SECRET ||
      !process.env.CAL_ID
    ) {
      throw new Error('Missing required environment variables')
    }

    // Configure auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_id: process.env.CAL_API_TEST,
        client_secret: process.env.CAL_API_SECRET,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    })

    try {
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

      console.log('Attempting to create calendar event:', calendarEvent)

      const response = await calendar.events.insert({
        calendarId: process.env.CAL_ID,
        resource: calendarEvent,
      })

      console.log('Calendar API Response:', response.data)

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'Event created successfully',
          eventId: response.data.id,
        }),
      }
    } catch (calendarError) {
      console.error('Calendar API Error:', calendarError)
      throw new Error(`Calendar API Error: ${calendarError.message}`)
    }
  } catch (error) {
    console.error('Function error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Error creating calendar event',
        error: error.message,
        stack: error.stack, // Remove this in production
      }),
    }
  }
}
