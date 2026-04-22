import { NextRequest, NextResponse } from "next/server"
import { DATASETS, filterDatasets } from "@/lib/datasets"
import type { FilterCategory } from "@/lib/datasets"
import type { ApiResponse } from "@/types"
import type { DatasetEntry } from "@/lib/datasets"

const VALID_DEVICE_TYPES = [
  "iphone",
  "android",
  "robot",
  "gopro",
  "insta360",
  "other",
] as const

type ValidDeviceType = (typeof VALID_DEVICE_TYPES)[number]

function isValidDeviceType(value: string): value is ValidDeviceType {
  return (VALID_DEVICE_TYPES as readonly string[]).includes(value)
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<DatasetEntry[]>>> {
  const { searchParams } = request.nextUrl

  const deviceType = searchParams.get("device_type")

  let results = DATASETS

  if (deviceType !== null) {
    if (!isValidDeviceType(deviceType)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: `Invalid device_type. Must be one of: ${VALID_DEVICE_TYPES.join(", ")}`,
        },
        { status: 400 }
      )
    }

    results = DATASETS.filter((d) =>
      d.device_types.includes(deviceType as DatasetEntry["device_types"][number])
    )
  }

  const filter = searchParams.get("filter") as FilterCategory | null
  if (filter && filter !== "all") {
    results = filterDatasets(results, filter)
  }

  return NextResponse.json({
    success: true,
    data: results,
    error: null,
    meta: { total: results.length, page: 1, limit: results.length },
  })
}
