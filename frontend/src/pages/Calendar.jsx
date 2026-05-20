import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import DashboardLayout from '../layouts/DashboardLayout';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, date: '2026-05-25', title: 'Project Deadline', type: 'deadline', color: 'red' },
    { id: 2, date: '2026-05-26', title: 'Team Meeting', type: 'meeting', color: 'blue' },
    { id: 3, date: '2026-05-27', title: 'Sprint Review', type: 'sprint', color: 'green' },
    { id: 4, date: '2026-05-28', title: 'Leave Day', type: 'leave', color: 'purple' },
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date) => {
    return events.filter(event => event.date === format(date, 'yyyy-MM-dd'));
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📅 Calendar & Timeline</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar View */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={previousMonth}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next →
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map(day => {
                const dayEvents = getEventsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

                return (
                  <div
                    key={format(day, 'yyyy-MM-dd')}
                    className={`min-h-24 p-2 rounded border-2 ${
                      isToday ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
                    } ${!isCurrentMonth ? 'bg-gray-100' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${
                      isCurrentMonth ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={`text-xs px-2 py-1 rounded text-white cursor-pointer truncate ${
                            event.color === 'red' ? 'bg-red-500' :
                            event.color === 'blue' ? 'bg-blue-500' :
                            event.color === 'green' ? 'bg-green-500' :
                            'bg-purple-500'
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📌 Upcoming Events</h3>
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="border-l-4 pl-3 py-2" style={{
                  borderColor: event.color === 'red' ? '#ef4444' :
                    event.color === 'blue' ? '#3b82f6' :
                    event.color === 'green' ? '#10b981' : '#a855f7'
                }}>
                  <div className="text-sm font-semibold text-gray-800">{event.title}</div>
                  <div className="text-xs text-gray-500">{event.date}</div>
                  <span className={`inline-block text-xs px-2 py-1 rounded mt-1 text-white ${
                    event.color === 'red' ? 'bg-red-500' :
                    event.color === 'blue' ? 'bg-blue-500' :
                    event.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">📈 Sprint Timeline</h3>
          <div className="space-y-6">
            {[
              { sprint: 'Sprint 1', start: 'May 1', end: 'May 14', progress: 100, status: 'Completed' },
              { sprint: 'Sprint 2', start: 'May 15', end: 'May 28', progress: 65, status: 'In Progress' },
              { sprint: 'Sprint 3', start: 'May 29', end: 'Jun 11', progress: 0, status: 'Planned' },
            ].map((sprint, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{sprint.sprint}</h4>
                    <p className="text-sm text-gray-600">{sprint.start} - {sprint.end}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded ${
                    sprint.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    sprint.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {sprint.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      sprint.status === 'Completed' ? 'bg-green-600' :
                      sprint.status === 'In Progress' ? 'bg-blue-600' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${sprint.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
