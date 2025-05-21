const { google } = require('googleapis')

exports.handler = async (event) => {
  // Add CORS headers
  const headers = {
    //'Access-Control-Allow-Origin': 'https://okayok.webflow.io',
    'Access-Control-Allow-Origin': '*',
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

    // More detailed environment variable logging
    const envVars = {
      hasProjectId: !!process.env.GOOGLE_PROJECT_ID,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasPrivateKeyId: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasCalendarId: !!process.env.CAL_ID,
      // Log actual values for non-sensitive vars to verify content
      projectId: process.env.GOOGLE_PROJECT_ID,
      clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
      calendarId: process.env.CAL_ID,
    }
    console.log('Environment variables check:', envVars)

    const { clientName, serviceName, partnerName, clientEmail, eventDate } =
      formData

    // Validate required environment variables
    if (
      !process.env.GOOGLE_PROJECT_ID ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_CLIENT_EMAIL ||
      !process.env.CAL_ID
    ) {
      throw new Error('Missing required environment variables')
    }

    // Configure auth with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
      },
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
    })

    try {
      const calendar = google.calendar({ version: 'v3', auth })

      // Convert date from MM/DD/YYYY to YYYY-MM-DD
      const [month, day, year] = eventDate.split('/')
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0'
      )}`

      // Create event
      const calendarEvent = {
        summary: `Wedding: ${clientName} & ${partnerName}`,
        description: `Service: ${serviceName}\nClient Email: ${clientEmail}`,
        start: {
          date: formattedDate,
          timeZone: 'America/Mexico_City',
        },
        end: {
          date: formattedDate,
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
      }),
    }
  }
}
