// Calendar Controller
// Handles calendar events, deadlines, meetings, and sprint planning

const getCalendarEvents = async (req, res) => {
  try {
    const { userId } = req.user;
    const { startDate, endDate } = req.query;

    // TODO: Fetch calendar events from database
    // Should include:
    // - Task deadlines
    // - Meetings
    // - Sprint planning
    // - Leave days
    // - Custom events

    const events = [
      {
        id: 1,
        date: '2026-05-25',
        title: 'Project Deadline',
        type: 'deadline',
        color: 'red',
        projectId: 'proj_1',
      },
      {
        id: 2,
        date: '2026-05-26',
        title: 'Team Meeting',
        type: 'meeting',
        color: 'blue',
        startTime: '10:00',
        endTime: '11:00',
      },
      {
        id: 3,
        date: '2026-05-27',
        title: 'Sprint Review',
        type: 'sprint',
        color: 'green',
        startTime: '14:00',
        endTime: '16:00',
      },
    ];

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSprints = async (req, res) => {
  try {
    const { projectId } = req.params;

    // TODO: Fetch sprint data from database
    const sprints = [
      {
        id: 1,
        name: 'Sprint 1',
        start: '2026-05-01',
        end: '2026-05-14',
        progress: 100,
        status: 'Completed',
      },
      {
        id: 2,
        name: 'Sprint 2',
        start: '2026-05-15',
        end: '2026-05-28',
        progress: 65,
        status: 'In Progress',
      },
      {
        id: 3,
        name: 'Sprint 3',
        start: '2026-05-29',
        end: '2026-06-11',
        progress: 0,
        status: 'Planned',
      },
    ];

    res.json(sprints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, date, type, description } = req.body;

    // TODO: Create calendar event
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date,
      type,
      description,
      createdAt: new Date(),
    };

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCalendarEvents,
  getSprints,
  createEvent,
};
