// src/lib/database/schema.ts

import {
	sqliteTable,
	text,
	integer,
	real,
	blob,
} from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// Authentication tables
export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: integer("email_verified", { mode: "boolean" })
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at", {
		mode: "timestamp",
	}),
	refreshTokenExpiresAt: integer("refresh_token_expires_at", {
		mode: "timestamp",
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
	updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
		() => /* @__PURE__ */ new Date()
	),
});

// PM2 Process Management tables
export const processes = sqliteTable("processes", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	name: text("name").notNull().unique(),
	script: text("script").notNull(),
	cwd: text("cwd").notNull(),
	args: text("args"), // JSON array of arguments
	execMode: text("exec_mode", { enum: ["fork", "cluster"] })
		.notNull()
		.default("fork"),
	instances: integer("instances").notNull().default(1),
	maxMemoryRestart: integer("max_memory_restart"),
	minUptime: integer("min_uptime"),
	maxRestarts: integer("max_restarts"),
	unstableRestarts: integer("unstable_restarts"),
	autorestart: integer("autorestart", { mode: "boolean" })
		.notNull()
		.default(true),
	watch: integer("watch", { mode: "boolean" }).notNull().default(false),
	ignoreWatch: text("ignore_watch"), // JSON array of ignored paths
	env: text("env"), // JSON object of environment variables
	envProduction: text("env_production"), // JSON object of production env vars
	envDevelopment: text("env_development"), // JSON object of development env vars
	sourceMapSupport: integer("source_map_support", { mode: "boolean" })
		.notNull()
		.default(false),
	disableSourceMapSupport: integer("disable_source_map_support", {
		mode: "boolean",
	})
		.notNull()
		.default(false),
	mergeLogs: integer("merge_logs", { mode: "boolean" })
		.notNull()
		.default(false),
	logFile: text("log_file"),
	outFile: text("out_file"),
	errorFile: text("error_file"),
	pidFile: text("pid_file"),
	nodeVersion: text("node_version"),
	interpreter: text("interpreter"),
	interpreterArgs: text("interpreter_args"),
	killTimeout: integer("kill_timeout").notNull().default(1600),
	listenTimeout: integer("listen_timeout").notNull().default(3000),
	waitReady: integer("wait_ready", { mode: "boolean" })
		.notNull()
		.default(false),
	pmx: integer("pmx", { mode: "boolean" }).notNull().default(true),
	vizion: integer("vizion", { mode: "boolean" }).notNull().default(true),
	automation: integer("automation", { mode: "boolean" })
		.notNull()
		.default(true),
	treekill: integer("treekill", { mode: "boolean" }).notNull().default(true),
	port: integer("port"),
	uid: text("uid"),
	gid: text("gid"),
	namespace: text("namespace"),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text("updated_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	createdBy: text("created_by").references(() => user.id),
	tags: text("tags"), // JSON array of tags for categorization
});

export const processStatus = sqliteTable("process_status", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id")
		.notNull()
		.references(() => processes.id, { onDelete: "cascade" }),
	pmId: integer("pm_id").notNull(),
	pid: integer("pid"),
	ppid: integer("ppid"),
	status: text("status", {
		enum: [
			"online",
			"stopped",
			"stopping",
			"waiting restart",
			"launching",
			"errored",
			"one-launch-status",
		],
	}).notNull(),
	restartTime: integer("restart_time").notNull().default(0),
	unstableRestarts: integer("unstable_restarts").notNull().default(0),
	uptime: integer("uptime").notNull().default(0),
	cpu: real("cpu").notNull().default(0),
	memory: integer("memory").notNull().default(0),
	heapSize: integer("heap_size"),
	heapUsage: integer("heap_usage"),
	usedHeapSize: integer("used_heap_size"),
	external: integer("external"),
	rss: integer("rss"),
	freeMemory: integer("free_memory"),
	totalMemory: integer("total_memory"),
	loadAvg: text("load_avg"), // JSON array of load averages [1, 5, 15]
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	versioning: text("versioning"),
	nodeEnv: text("node_env"),
});

export const processMetrics = sqliteTable("process_metrics", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id")
		.notNull()
		.references(() => processes.id, { onDelete: "cascade" }),
	cpu: real("cpu").notNull(),
	memory: integer("memory").notNull(),
	heapSize: integer("heap_size"),
	heapUsage: integer("heap_usage"),
	eventLoopLatency: real("event_loop_latency"),
	eventLoopLatencyP95: real("event_loop_latency_p95"),
	activeRequests: integer("active_requests"),
	activeHandles: integer("active_handles"),
	httpMeanLatency: real("http_mean_latency"),
	httpP95Latency: real("http_p95_latency"),
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const logs = sqliteTable("logs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id")
		.notNull()
		.references(() => processes.id, { onDelete: "cascade" }),
	type: text("type", { enum: ["out", "error", "pm2"] }).notNull(),
	message: text("message").notNull(),
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	level: text("level", { enum: ["info", "warn", "error", "debug"] }),
	rawMessage: text("raw_message").notNull(),
});

export const processEvents = sqliteTable("process_events", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id")
		.notNull()
		.references(() => processes.id, { onDelete: "cascade" }),
	eventType: text("event_type", {
		enum: [
			"start",
			"stop",
			"restart",
			"delete",
			"reload",
			"graceful_reload",
			"error",
			"exit",
			"launch",
			"online",
		],
	}).notNull(),
	message: text("message"),
	exitCode: integer("exit_code"),
	signal: text("signal"),
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	triggeredBy: text("triggered_by"),
	duration: integer("duration"),
});

export const alerts = sqliteTable("alerts", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id").references(() => processes.id, {
		onDelete: "cascade",
	}),
	alertType: text("alert_type", {
		enum: ["high_cpu", "high_memory", "process_down", "restart_loop", "custom"],
	}).notNull(),
	severity: text("severity", {
		enum: ["low", "medium", "high", "critical"],
	}).notNull(),
	title: text("title").notNull(),
	message: text("message").notNull(),
	thresholdValue: real("threshold_value"),
	actualValue: real("actual_value"),
	isResolved: integer("is_resolved", { mode: "boolean" })
		.notNull()
		.default(false),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	resolvedAt: text("resolved_at"),
	acknowledgedAt: text("acknowledged_at"),
	acknowledgedBy: text("acknowledged_by"),
});

export const alertRules = sqliteTable("alert_rules", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	processId: integer("process_id").references(() => processes.id, {
		onDelete: "cascade",
	}),
	ruleName: text("rule_name").notNull(),
	ruleType: text("rule_type", {
		enum: [
			"cpu_threshold",
			"memory_threshold",
			"restart_count",
			"uptime_threshold",
			"custom",
		],
	}).notNull(),
	condition: text("condition").notNull(), // JSON object describing the condition
	threshold: real("threshold").notNull(),
	duration: integer("duration").notNull(), // How long condition must persist (seconds)
	severity: text("severity", {
		enum: ["low", "medium", "high", "critical"],
	}).notNull(),
	isEnabled: integer("is_enabled", { mode: "boolean" }).notNull().default(true),
	notificationChannels: text("notification_channels"), // JSON array of notification methods
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text("updated_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const processTemplates = sqliteTable("process_templates", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	templateName: text("template_name").notNull().unique(),
	description: text("description"),
	configuration: text("configuration").notNull(), // JSON object with default PM2 configuration
	tags: text("tags"), // JSON array of tags
	isDefault: integer("is_default", { mode: "boolean" })
		.notNull()
		.default(false),
	createdAt: text("created_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	updatedAt: text("updated_at")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
	createdBy: text("created_by").references(() => user.id),
});

export const systemInfo = sqliteTable("system_info", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	hostname: text("hostname").notNull(),
	platform: text("platform").notNull(),
	arch: text("arch").notNull(),
	nodeVersion: text("node_version").notNull(),
	pm2Version: text("pm2_version").notNull(),
	cpuCores: integer("cpu_cores").notNull(),
	totalMemory: integer("total_memory").notNull(),
	freeMemory: integer("free_memory").notNull(),
	loadAvg: text("load_avg").notNull(), // JSON array [1, 5, 15]
	uptime: integer("uptime").notNull(),
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

export const auditLog = sqliteTable("audit_log", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: text("user_id").references(() => user.id),
	processId: integer("process_id").references(() => processes.id, {
		onDelete: "cascade",
	}),
	action: text("action").notNull(),
	details: text("details"), // JSON object with action details
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	timestamp: text("timestamp")
		.notNull()
		.$defaultFn(() => new Date().toISOString()),
});

// Export all tables for relations
export const schema = {
	user,
	session,
	account,
	verification,
	processes,
	processStatus,
	processMetrics,
	logs,
	processEvents,
	alerts,
	alertRules,
	processTemplates,
	systemInfo,
	auditLog,
};

// Type exports
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;
export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;
export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;

export type Process = typeof processes.$inferSelect;
export type NewProcess = typeof processes.$inferInsert;
export type ProcessStatus = typeof processStatus.$inferSelect;
export type NewProcessStatus = typeof processStatus.$inferInsert;
export type ProcessMetric = typeof processMetrics.$inferSelect;
export type NewProcessMetric = typeof processMetrics.$inferInsert;
export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;
export type ProcessEvent = typeof processEvents.$inferSelect;
export type NewProcessEvent = typeof processEvents.$inferInsert;
export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
export type AlertRule = typeof alertRules.$inferSelect;
export type NewAlertRule = typeof alertRules.$inferInsert;
export type ProcessTemplate = typeof processTemplates.$inferSelect;
export type NewProcessTemplate = typeof processTemplates.$inferInsert;
export type SystemInfo = typeof systemInfo.$inferSelect;
export type NewSystemInfo = typeof systemInfo.$inferInsert;
export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
