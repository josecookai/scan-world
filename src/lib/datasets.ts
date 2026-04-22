export interface DatasetEntry {
  id: string
  name: string
  fullName: string
  description: string
  focus: string[]
  item_count: number | null
  duration_hours: number | null
  license: "apache-2.0" | "cc-by-4.0" | "research-only" | "mixed"
  source_url: string
  download_url: string | null
  paper_url: string | null
  device_types: Array<"iphone" | "android" | "gopro" | "robot" | "insta360" | "other">
  tags: string[]
  scan_world_note: string
}

export const DATASETS: DatasetEntry[] = [
  {
    id: "droid",
    name: "DROID",
    fullName: "Diverse Robot Demonstration Data",
    description:
      "Large-scale dataset of diverse robot manipulation demonstrations collected across multiple environments and robot platforms. 76,000 demonstration trajectories from 86 building locations.",
    focus: ["robot manipulation", "diverse environments"],
    item_count: 76000,
    duration_hours: null,
    license: "apache-2.0",
    source_url: "https://droid-dataset.github.io",
    download_url: "https://huggingface.co/datasets/droid-dataset/droid",
    paper_url: "https://arxiv.org/abs/2403.12945",
    device_types: ["robot"],
    tags: ["manipulation", "multi-robot", "diverse"],
    scan_world_note:
      "DROID covers robot-eye-view. Scan the World adds human-eye-view from the same environments.",
  },
  {
    id: "open-x-embodiment",
    name: "Open X-Embodiment",
    fullName: "Open X-Embodiment: Robotic Learning Datasets",
    description:
      "A collection of datasets from 22 different robot embodiments, covering over 1 million robot episodes. The largest cross-embodiment robot learning dataset.",
    focus: ["cross-embodiment", "generalization"],
    item_count: 1000000,
    duration_hours: null,
    license: "mixed",
    source_url: "https://robotics-transformer-x.github.io",
    download_url: "https://huggingface.co/datasets/jxu124/OpenX-Embodiment",
    paper_url: "https://arxiv.org/abs/2310.08864",
    device_types: ["robot"],
    tags: ["multi-robot", "large-scale", "google"],
    scan_world_note:
      "Open X-Embodiment is robot-only. Scan the World provides the human environmental context these robots will operate in.",
  },
  {
    id: "bridgedata-v2",
    name: "BridgeData V2",
    fullName: "BridgeData V2: Datasets for Robot Learning at Scale",
    description:
      "60,000 demonstrations of diverse tabletop robot manipulation tasks across 24 environments. Designed for offline RL and behavior cloning.",
    focus: ["tabletop manipulation", "behavior cloning"],
    item_count: 60000,
    duration_hours: null,
    license: "cc-by-4.0",
    source_url: "https://rail-berkeley.github.io/bridgedata/",
    download_url: "https://rail.eecs.berkeley.edu/datasets/bridge_release/",
    paper_url: "https://arxiv.org/abs/2308.12952",
    device_types: ["robot"],
    tags: ["tabletop", "berkeley", "offline-rl"],
    scan_world_note:
      "BridgeData V2 focuses on tabletop tasks. Scan the World adds the broader world context robots will navigate between tasks.",
  },
  {
    id: "ego4d",
    name: "Ego4D",
    fullName: "Ego4D: Around the World in 3,000 Hours of Egocentric Video",
    description:
      "3,670 hours of daily-life activity video from 74 worldwide locations across 9 countries. First-person perspective of human activities in the wild.",
    focus: ["egocentric", "daily activities", "diverse geography"],
    item_count: null,
    duration_hours: 3670,
    license: "research-only",
    source_url: "https://ego4d-data.org",
    download_url: "https://ego4d-data.org/#download",
    paper_url: "https://arxiv.org/abs/2110.07058",
    device_types: ["iphone", "android"],
    tags: ["egocentric", "facebook", "activities"],
    scan_world_note:
      "Ego4D is research-only. Scan the World offers an open, community-built alternative with broader geographic coverage.",
  },
  {
    id: "epic-kitchens",
    name: "EPIC-Kitchens",
    fullName: "EPIC-Kitchens 100",
    description:
      "100 hours of egocentric cooking video in 45 kitchens from 37 participants across 4 cities. Annotated with action narrations and object annotations.",
    focus: ["kitchen activities", "action recognition"],
    item_count: null,
    duration_hours: 100,
    license: "research-only",
    source_url: "https://epic-kitchens.github.io",
    download_url: "https://epic-kitchens.github.io/2024",
    paper_url: "https://arxiv.org/abs/2006.13256",
    device_types: ["gopro"],
    tags: ["kitchen", "cooking", "action-recognition"],
    scan_world_note:
      "EPIC-Kitchens covers one room. Scan the World expands to all rooms and all environments, globally.",
  },
  {
    id: "something-something",
    name: "Something-Something v2",
    fullName: "The Something-Something Video Database",
    description:
      "220,847 short video clips of humans performing hand-object interactions with everyday objects. Labeled with 174 verb-based action categories.",
    focus: ["hand-object interaction", "action classification"],
    item_count: 220847,
    duration_hours: null,
    license: "research-only",
    source_url:
      "https://developer.qualcomm.com/software/ai-datasets/something-something",
    download_url: null,
    paper_url: "https://arxiv.org/abs/1706.04261",
    device_types: ["android", "iphone"],
    tags: ["hand-object", "qualcomm", "classification"],
    scan_world_note:
      "Something-Something focuses on scripted gestures. Scan the World captures real-world human-object interaction in natural context.",
  },
  {
    id: "lerobot",
    name: "LeRobot Dataset",
    fullName: "Hugging Face LeRobot Datasets",
    description:
      "Collection of robot manipulation datasets hosted on HuggingFace for the LeRobot framework. Includes ALOHA, PushT, and other environments.",
    focus: ["robot manipulation", "imitation learning"],
    item_count: null,
    duration_hours: null,
    license: "apache-2.0",
    source_url: "https://github.com/huggingface/lerobot",
    download_url: "https://huggingface.co/lerobot",
    paper_url: null,
    device_types: ["robot"],
    tags: ["huggingface", "imitation-learning", "open-source"],
    scan_world_note:
      "LeRobot provides robot-arm data. Scan the World provides the environmental backdrop these robots operate in.",
  },
]

export type FilterCategory =
  | "all"
  | "iphone-mobile"
  | "robot-pov"
  | "egocentric"
  | "outdoor"

export function filterDatasets(
  datasets: DatasetEntry[],
  filter: FilterCategory
): DatasetEntry[] {
  if (filter === "all") return datasets
  if (filter === "iphone-mobile")
    return datasets.filter(
      (d) =>
        d.device_types.includes("iphone") || d.device_types.includes("android")
    )
  if (filter === "robot-pov")
    return datasets.filter((d) => d.device_types.includes("robot"))
  if (filter === "egocentric")
    return datasets.filter(
      (d) =>
        d.focus.some((f) => f.toLowerCase().includes("egocentric")) ||
        d.device_types.includes("gopro") ||
        d.device_types.includes("iphone") ||
        d.device_types.includes("android")
    )
  if (filter === "outdoor")
    return datasets.filter(
      (d) =>
        d.focus.some((f) =>
          ["outdoor", "geography", "diverse", "wild"].some((kw) =>
            f.toLowerCase().includes(kw)
          )
        ) ||
        d.tags.some((t) =>
          ["outdoor", "diverse", "activities"].some((kw) =>
            t.toLowerCase().includes(kw)
          )
        )
    )
  return datasets
}

export function getDatasetById(id: string): DatasetEntry | undefined {
  return DATASETS.find((d) => d.id === id)
}

export function getRelatedDatasets(
  dataset: DatasetEntry,
  limit = 3
): DatasetEntry[] {
  return DATASETS.filter((d) => d.id !== dataset.id)
    .map((d) => {
      const sharedFocus = d.focus.filter((f) => dataset.focus.includes(f))
      const sharedTags = d.tags.filter((t) => dataset.tags.includes(t))
      const sharedDevices = d.device_types.filter((dt) =>
        dataset.device_types.includes(dt)
      )
      return {
        dataset: d,
        score: sharedFocus.length * 3 + sharedTags.length * 2 + sharedDevices.length,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.dataset)
}
