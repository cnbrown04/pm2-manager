// src/lib/database/relations.ts

import { relations } from "drizzle-orm";
import {
	user,
	session,
	account,
	processes,
	processStatus,
	processMetrics,
	logs,
	processEvents,
	alerts,
	alertRules,
	processTemplates,
	auditLog,
} from "./schema";

// User relations
export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	processes: many(processes),
	processTemplates: many(processTemplates),
	auditLogs: many(auditLog),
}));

// Session relations
export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

// Account relations
export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

// Process relations
export const processRelations = relations(processes, ({ one, many }) => ({
	creator: one(user, {
		fields: [processes.createdBy],
		references: [user.id],
	}),
	processStatus: many(processStatus),
	processMetrics: many(processMetrics),
	logs: many(logs),
	processEvents: many(processEvents),
	alerts: many(alerts),
	alertRules: many(alertRules),
	auditLogs: many(auditLog),
}));

// Process Status relations
export const processStatusRelations = relations(processStatus, ({ one }) => ({
	process: one(processes, {
		fields: [processStatus.processId],
		references: [processes.id],
	}),
}));

// Process Metrics relations
export const processMetricsRelations = relations(processMetrics, ({ one }) => ({
	process: one(processes, {
		fields: [processMetrics.processId],
		references: [processes.id],
	}),
}));

// Logs relations
export const logsRelations = relations(logs, ({ one }) => ({
	process: one(processes, {
		fields: [logs.processId],
		references: [processes.id],
	}),
}));

// Process Events relations
export const processEventsRelations = relations(processEvents, ({ one }) => ({
	process: one(processes, {
		fields: [processEvents.processId],
		references: [processes.id],
	}),
}));

// Alerts relations
export const alertsRelations = relations(alerts, ({ one }) => ({
	process: one(processes, {
		fields: [alerts.processId],
		references: [processes.id],
	}),
}));

// Alert Rules relations
export const alertRulesRelations = relations(alertRules, ({ one }) => ({
	process: one(processes, {
		fields: [alertRules.processId],
		references: [processes.id],
	}),
}));

// Process Templates relations
export const processTemplatesRelations = relations(
	processTemplates,
	({ one }) => ({
		creator: one(user, {
			fields: [processTemplates.createdBy],
			references: [user.id],
		}),
	})
);

// Audit Log relations
export const auditLogRelations = relations(auditLog, ({ one }) => ({
	user: one(user, {
		fields: [auditLog.userId],
		references: [user.id],
	}),
	process: one(processes, {
		fields: [auditLog.processId],
		references: [processes.id],
	}),
}));
