import api from './api'

export interface EventStats {
  total_events: number
  unique_users: number
  event_types: Record<string, number>
  avg_events_per_user: number
  recent_events?: any[]
}

export interface EventItem {
  id: string
  eventType: string
  userId: string
  courseId?: string
  timestamp: string
}

export const eventService = {
  getStats: async (): Promise<EventStats> => {
    try {
      const res = await api.get('/event-capture/api/v1/events')
      const events = res.data || []
      return {
        total_events: events.length,
        unique_users: new Set(events.map((e: any) => e.user_id)).size,
        event_types: events.reduce((acc: any, event: any) => {
          acc[event.event_type] = (acc[event.event_type] || 0) + 1
          return acc
        }, {}),
        avg_events_per_user: events.length / new Set(events.map((e: any) => e.user_id)).size,
        recent_events: events.slice(0, 5)
      }
    } catch (error) {
      console.error('Failed to fetch event stats:', error)
      return {
        total_events: 0,
        unique_users: 0,
        event_types: {},
        avg_events_per_user: 0,
        recent_events: []
      }
    }
  },

  getEvents: async (params?: {
    userId?: string
    courseId?: string
    limit?: number
  }): Promise<EventItem[]> => {
    const res = await api.get('/event-capture/api/v1/events', { params })
    return (res.data ?? []).map((raw: any) => ({
      id: raw.event_id ?? raw.id ?? '',
      eventType: raw.event_type ?? '',
      userId: raw.user_id ?? '',
      courseId: raw.course_id,
      timestamp: raw.timestamp ?? '',
    }))
  },
}
