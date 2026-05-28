import api from './api'

const EVENT_SERVICE_URL = import.meta.env.VITE_EVENT_SERVICE_URL || 'https://event-service-production-e1c9.up.railway.app'

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
      const res = await api.get(`${EVENT_SERVICE_URL}/api/v1/events/stats`)
      return res.data
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
    const res = await api.get(`${EVENT_SERVICE_URL}/api/v1/events`, { params })
    return (res.data ?? []).map((raw: any) => ({
      id: raw.event_id ?? raw.id ?? '',
      eventType: raw.event_type ?? '',
      userId: raw.user_id ?? '',
      courseId: raw.course_id,
      timestamp: raw.timestamp ?? '',
    }))
  },
}
