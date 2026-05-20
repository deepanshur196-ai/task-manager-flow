// Analytics Controller
// Provides analytics data for tasks, projects, and team performance

import Task from '../models/Task.js';

const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id || req.user.userId;
    let tasks = [];

    if (userId) {
      tasks = await Task.find({
        $or: [
          { createdBy: userId },
          { assignedUser: userId },
        ],
      });
    }

    if (!tasks.length && (req.user.role === 'Admin' || req.user.designation === 'Project Lead')) {
      tasks = await Task.find({});
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === 'Completed').length;
    const delayedTasks = tasks.filter((task) => task.dueDate && task.dueDate < new Date() && task.status !== 'Completed').length;

    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const weeklyPerformance = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      const formatted = date.toISOString().slice(0, 10);
      const tasksForDay = tasks.filter((task) => task.createdAt && task.createdAt.toISOString().slice(0, 10) === formatted);
      const completedForDay = tasksForDay.filter((task) => task.status === 'Completed').length;
      return {
        day: dayLabels[date.getDay()],
        tasks: tasksForDay.length,
        completed: completedForDay,
      };
    });

    const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const teamEfficiency = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const focusHours = Math.min(80, completedTasks * 2) + Math.round(Math.max(0, totalTasks - completedTasks) * 0.5);

    let burnoutRisk = 'Low';
    const overdueRatio = totalTasks ? delayedTasks / totalTasks : 0;
    if (overdueRatio > 0.35) burnoutRisk = 'High';
    else if (overdueRatio > 0.15 || totalTasks - completedTasks >= 8) burnoutRisk = 'Medium';

    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});

    const taskStatus = [
      { name: 'Completed', value: statusCounts.Completed || 0, color: '#10b981' },
      { name: 'In Progress', value: statusCounts['In Progress'] || 0, color: '#3b82f6' },
      { name: 'Todo', value: statusCounts.Todo || 0, color: '#f59e0b' },
    ];

    res.json({
      completionRate,
      delayedTasks,
      weeklyPerformance,
      teamEfficiency,
      focusHours,
      burnoutRisk,
      taskStatus,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeamAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params;

    // TODO: Get team-specific analytics for a project
    const teamAnalytics = {
      teamEfficiency: 82,
      tasksCompleted: 45,
      tasksInProgress: 12,
      tasksPending: 8,
      averageCompletionTime: 2.5,
      topPerformers: [
        { name: 'John Doe', tasksCompleted: 12 },
        { name: 'Jane Smith', tasksCompleted: 10 },
        { name: 'Mike Johnson', tasksCompleted: 9 },
      ],
    };

    res.json(teamAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAnalytics,
  getTeamAnalytics,
};
