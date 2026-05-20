// Calendar Controller
// Handles calendar events, deadlines, meetings, and sprint planning

const events = [
  {
    id: '1',
    date: '2026-05-25',
    title: 'Project Deadline',
    type: 'deadline',
    color: 'red',
    projectId: 'proj_1',
  },
  {
    id: '2',
    date: '2026-05-26',
    title: 'Team Meeting',
    type: 'meeting',
    color: 'blue',
    startTime: '10:00',
    endTime: '11:00',
  },
  {
    id: '3',
    date: '2026-05-27',
    title: 'Sprint Review',
    type: 'sprint',
    color: 'green',
    startTime: '14:00',
    endTime: '16:00',
  },
];

const getCalendarEvents = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filteredEvents = events;

    if (startDate || endDate) {
      filteredEvents = events.filter((event) => {
        const eventDate = new Date(event.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (start && eventDate < start) return false;
        if (end && eventDate > end) return false;
        return true;
      });
    }

    res.json(filteredEvents);
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
    const event = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      date,
      type,
      description,
      color: type === 'deadline' ? 'red' : type === 'meeting' ? 'blue' : type === 'sprint' ? 'green' : type === 'leave' ? 'purple' : 'gray',
      createdAt: new Date(),
    };

    events.push(event);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getCalendarEvents,
  getSprints,
  createEvent,
};
