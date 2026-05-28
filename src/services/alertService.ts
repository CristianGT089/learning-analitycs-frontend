import api from './api'

const ALERT_SERVICE_URL = import.meta.env.VITE_ALERT_SERVICE_URL || 'https://alert-service-production-5655.up.railway.app'

export interface AlertItem {
  id: string
  studentId: string
  studentName: string
  riskScore: number
  riskLevel: string
  alertType: string
  message: string
  timestamp: string
  status: string
  acknowledged: boolean
  resolved: boolean
  notificationSent: boolean
  courseId?: string
}

export interface AlertStats {
  total_alerts: number
  unacknowledged_alerts: number
  unresolved_alerts: number
  alerts_by_level: Record<string, number>
}

const mapAlert = (raw: any): AlertItem => ({
  id: raw.alert_id ?? raw.id ?? '',
  studentId: raw.user_id ?? raw.student_id ?? '',
  studentName: raw.user_id ?? raw.student_id ?? 'Desconocido',
  riskScore: raw.risk_score ?? 0,
  riskLevel: mapRiskLevel(raw.risk_level),
  alertType: raw.alert_type ?? 'academic_risk',
  message: raw.message ?? raw.reason ?? '',
  timestamp: raw.timestamp ?? raw.created_at ?? new Date().toISOString(),
  status: raw.resolved ? 'resolved' : raw.acknowledged ? 'acknowledged' : 'active',
  acknowledged: raw.acknowledged ?? false,
  resolved: raw.resolved ?? false,
  notificationSent: raw.notificationSent ?? false,
  courseId: raw.course_id,
})

const mapRiskLevel = (level: string): string => {
  const map: Record<string, string> = {
    high: 'alto', critical: 'alto',
    medium: 'medio',
    low: 'bajo',
  }
  return map[level] ?? level
}

export const alertService = {
  getAlerts: async (): Promise<AlertItem[]> => {
    const res = await api.get(`${ALERT_SERVICE_URL}/api/v1/alerts`)
    return (res.data ?? []).map(mapAlert)
  },

  getStats: async (): Promise<AlertStats> => {
    const res = await api.get(`${ALERT_SERVICE_URL}/api/v1/alerts/stats`)
    return res.data
  },

  acknowledge: async (alertId: string): Promise<void> => {
    await api.post(`${ALERT_SERVICE_URL}/api/v1/alerts/${alertId}/acknowledge`)
  },

  resolve: async (alertId: string): Promise<void> => {
    await api.post(`${ALERT_SERVICE_URL}/api/v1/alerts/${alertId}/resolve`)
  },

  createAlert: async (alertData: {
    userId: string
    riskLevel: string
    alertType: string
    message: string
  }): Promise<AlertItem> => {
    const res = await api.post(`${ALERT_SERVICE_URL}/api/v1/alerts`, alertData)
    return mapAlert(res.data)
  },
}
