import api from './api'

export interface RiskAlert {
  id: string
  studentId: string
  studentName: string
  institution: string
  riskScore: number
  riskLevel: string
  alertType: string
  message: string
  timestamp: string
  status: string
  acknowledged: boolean
  resolved: boolean
  factors: string[]
  recommendations: string[]
}

export interface RiskStats {
  total_users: number
  high_risk: number
  medium_risk: number
  low_risk: number
}

const mapRiskLevel = (level: string): string => {
  const map: Record<string, string> = {
    high: 'alto', critical: 'alto',
    medium: 'medio',
    low: 'bajo',
  }
  return map[level] ?? level
}

const mapRiskAlert = (raw: any): RiskAlert => ({
  id: raw.alert_id ?? raw.id ?? '',
  studentId: raw.user_id ?? '',
  studentName: raw.user_id ?? 'Desconocido',
  institution: raw.institution ?? 'Universidad Nacional',
  riskScore: raw.risk_score ?? 0,
  riskLevel: mapRiskLevel(raw.risk_level),
  alertType: raw.alert_type ?? 'academic_risk',
  message: raw.message ?? raw.reason ?? '',
  timestamp: raw.timestamp ?? raw.created_at ?? new Date().toISOString(),
  status: raw.resolved ? 'resolved' : raw.acknowledged ? 'acknowledged' : 'active',
  acknowledged: raw.acknowledged ?? false,
  resolved: raw.resolved ?? false,
  factors: raw.risk_factors ?? [],
  recommendations: raw.recommendations ?? [],
})

export const riskService = {
  getAlerts: async (): Promise<RiskAlert[]> => {
    const res = await api.get('/academic-risk/api/v1/risk/alerts')
    return (res.data ?? []).map(mapRiskAlert)
  },

  getStats: async (): Promise<RiskStats> => {
    const res = await api.get('/academic-risk/api/v1/risk/stats')
    return res.data
  },

  acknowledge: async (alertId: string): Promise<void> => {
    await api.post(`/academic-risk/api/v1/risk/alerts/${alertId}/acknowledge`)
  },

  resolve: async (alertId: string): Promise<void> => {
    await api.post(`/academic-risk/api/v1/risk/alerts/${alertId}/resolve`)
  },
}
