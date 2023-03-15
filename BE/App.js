const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const chime = new AWS.Chime({ region: 'us-east-1' });
const port = process.env.PORT || 3001;

app.post('/create-meeting', async (req, res) => {
  try {
    const { externalId } = req.body;
    const meeting = await chime.createMeeting({
      ExternalMeetingId: externalId,
      MediaRegion: 'us-east-1'
    }).promise();
    const meetingId = meeting.Meeting.MeetingId;
    const joinToken = await chime.createAttendee({
      MeetingId: meetingId,
      ExternalUserId: uuidv4()
    }).promise();
    res.json({
      meetingId,
      joinToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to create meeting'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.post('/create-attendee', async (req,res) => {

    
})