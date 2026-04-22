export type DeviceType = "iphone" | "gopro" | "insta360" | "android" | "other"

export type SubmissionStatus = "pending" | "accepted" | "rejected" | "flagged"

export type SubmissionCategory =
  | "nature"
  | "urban"
  | "infrastructure"
  | "transport"
  | "culture"
  | "weather"
  | "agriculture"
  | "construction"
  | "crowds"
  | "other"

export type UserTier =
  | "scout"
  | "explorer"
  | "correspondent"
  | "field_agent"
  | "world_scanner"

export interface User {
  id: string
  email: string
  username: string | null
  avatar_url: string | null
  bio: string | null
  country: string | null
  points: number
  tier: UserTier
  role: "user" | "admin"
  created_at: string
}

export interface Submission {
  id: string
  user_id: string
  platform: "youtube" | "tiktok"
  video_url: string
  video_id: string
  title: string | null
  thumbnail_url: string | null
  duration_seconds: number | null
  location_country: string | null
  location_city: string | null
  lat: number | null
  lng: number | null
  category: SubmissionCategory | null
  description: string | null
  device_type: DeviceType | null
  status: SubmissionStatus
  quality_score: number | null   // 0-100, set by admin
  points_awarded: number | null
  submitted_at: string
  reviewed_at: string | null
  points_awarded_at: string | null  // 24h after acceptance
}

export interface PointEvent {
  id: string
  user_id: string
  amount: number
  reason: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface PointTransfer {
  id: string
  from_user_id: string
  to_user_id: string
  amount: number
  note: string | null
  created_at: string
}

export interface ExternalDataset {
  id: string
  name: string
  description: string
  focus: string
  item_count: number | null
  duration_hours: number | null
  license: string
  source_url: string
  download_url: string | null
  paper_url: string | null
  device_types: DeviceType[]
  indexed_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error: string | null
  meta?: Record<string, unknown>
}
