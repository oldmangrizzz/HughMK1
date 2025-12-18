import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  conversations: defineTable({
    userId: v.string(),
    sessionId: v.optional(v.string()),
    timestamp: v.number(),
    role: v.union(v.literal("user"), v.literal("hugh"), v.literal("system")),
    content: v.string(),
    metadata: v.optional(v.object({
      location: v.optional(v.string()),
      device: v.optional(v.string()),
      tags: v.optional(v.array(v.string())),
    })),
  })
    .index("by_user", ["userId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_session", ["sessionId"])
    .index("by_user_timestamp", ["userId", "timestamp"]),

  knowledge: defineTable({
    userId: v.string(),
    category: v.string(),
    key: v.string(),
    value: v.string(),
    confidence: v.number(),
    source: v.optional(v.string()),
    lastAccessed: v.number(),
    lastModified: v.number(),
    accessCount: v.number(),
    verified: v.boolean(),
  })
    .index("by_user_category", ["userId", "category"])
    .index("by_key", ["key"])
    .index("by_user_key", ["userId", "key"]),
});
