import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type QueryGroup, createEmptyGroup } from '@/lib/query-builder';

export type WidgetType =
  | 'stat-card'
  | 'pie-chart'
  | 'bar-chart'
  | 'line-chart'
  | 'data-table'
  | 'recent-activity'
  | 'filter';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  config: {
    // Stat card config
    statField?: string;
    // Chart config
    dataField?: string;
    groupBy?: string;
    // Table config
    columns?: string[];
    limit?: number;
    // Filter widget config
    query?: QueryGroup;
  };
}

export interface CustomDashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  query: QueryGroup; // Filter query for this dashboard
  createdAt: string;
  updatedAt: string;
}

interface CustomDashboardStore {
  dashboards: CustomDashboard[];
  activeDashboardId: string | null;
  isEditing: boolean;

  // Actions
  createDashboard: (name: string, description?: string) => string;
  updateDashboard: (id: string, updates: Partial<Pick<CustomDashboard, 'name' | 'description'>>) => void;
  deleteDashboard: (id: string) => void;
  duplicateDashboard: (id: string) => string;
  setActiveDashboard: (id: string | null) => void;
  setIsEditing: (editing: boolean) => void;

  // Query actions
  updateDashboardQuery: (dashboardId: string, query: QueryGroup) => void;

  // Widget actions
  addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => void;
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => void;
  removeWidget: (dashboardId: string, widgetId: string) => void;
  reorderWidgets: (dashboardId: string, widgetIds: string[]) => void;
}

// Default widget templates
export const WIDGET_TEMPLATES: Record<string, Omit<DashboardWidget, 'id'>> = {
  'total-personnel': {
    type: 'stat-card',
    title: 'Total Personnel',
    size: 'small',
    config: { statField: 'total' },
  },
  'combat-ready': {
    type: 'stat-card',
    title: 'Combat Ready',
    size: 'small',
    config: { statField: 'combatReady' },
  },
  'medical-ready': {
    type: 'stat-card',
    title: 'Medical Ready',
    size: 'small',
    config: { statField: 'medicalReady' },
  },
  'deployable': {
    type: 'stat-card',
    title: 'Deployable',
    size: 'small',
    config: { statField: 'deployable' },
  },
  'branch-distribution': {
    type: 'pie-chart',
    title: 'Branch Distribution',
    size: 'medium',
    config: { groupBy: 'branch' },
  },
  'clearance-distribution': {
    type: 'pie-chart',
    title: 'Clearance Distribution',
    size: 'medium',
    config: { groupBy: 'clearanceLevel' },
  },
  'readiness-distribution': {
    type: 'bar-chart',
    title: 'Readiness Status',
    size: 'medium',
    config: { groupBy: 'medicalReadiness' },
  },
  'rank-distribution': {
    type: 'bar-chart',
    title: 'Rank Distribution',
    size: 'medium',
    config: { groupBy: 'rank' },
  },
  'personnel-table': {
    type: 'data-table',
    title: 'Personnel Overview',
    size: 'full',
    config: {
      columns: ['lastName', 'firstName', 'rank', 'branch', 'unit'],
      limit: 10
    },
  },
  'recent-activity': {
    type: 'recent-activity',
    title: 'Recent Activity',
    size: 'medium',
    config: {},
  },
  'filter': {
    type: 'filter',
    title: 'Data Filter',
    size: 'full',
    config: {
      query: createEmptyGroup(),
    },
  },
};

export const useCustomDashboardStore = create<CustomDashboardStore>()(
  persist(
    (set, get) => ({
      dashboards: [],
      activeDashboardId: null,
      isEditing: false,

      createDashboard: (name, description) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        set((state) => ({
          dashboards: [
            ...state.dashboards,
            {
              id,
              name,
              description,
              widgets: [],
              query: createEmptyGroup(),
              createdAt: now,
              updatedAt: now,
            },
          ],
          activeDashboardId: id,
        }));

        return id;
      },

      updateDashboard: (id, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === id
              ? { ...d, ...updates, updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      deleteDashboard: (id) => {
        set((state) => ({
          dashboards: state.dashboards.filter((d) => d.id !== id),
          activeDashboardId:
            state.activeDashboardId === id ? null : state.activeDashboardId,
        }));
      },

      duplicateDashboard: (id) => {
        const state = get();
        const dashboard = state.dashboards.find((d) => d.id === id);
        if (!dashboard) return '';

        const newId = crypto.randomUUID();
        const now = new Date().toISOString();

        // Deep copy the query
        const copyQuery = (group: QueryGroup): QueryGroup => ({
          ...group,
          id: crypto.randomUUID(),
          conditions: group.conditions.map(c => ({ ...c, id: crypto.randomUUID() })),
          groups: group.groups?.map(copyQuery),
        });

        set((state) => ({
          dashboards: [
            ...state.dashboards,
            {
              ...dashboard,
              id: newId,
              name: `${dashboard.name} (Copy)`,
              widgets: dashboard.widgets.map((w) => ({
                ...w,
                id: crypto.randomUUID(),
              })),
              query: dashboard.query ? copyQuery(dashboard.query) : createEmptyGroup(),
              createdAt: now,
              updatedAt: now,
            },
          ],
        }));

        return newId;
      },

      setActiveDashboard: (id) => {
        set({ activeDashboardId: id, isEditing: false });
      },

      setIsEditing: (editing) => {
        set({ isEditing: editing });
      },

      updateDashboardQuery: (dashboardId, query) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? { ...d, query, updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      addWidget: (dashboardId, widget) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: [...d.widgets, { ...widget, id: crypto.randomUUID() }],
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.map((w) =>
                    w.id === widgetId ? { ...w, ...updates } : w
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      removeWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) =>
            d.id === dashboardId
              ? {
                  ...d,
                  widgets: d.widgets.filter((w) => w.id !== widgetId),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      reorderWidgets: (dashboardId, widgetIds) => {
        set((state) => ({
          dashboards: state.dashboards.map((d) => {
            if (d.id !== dashboardId) return d;
            const widgetMap = new Map(d.widgets.map((w) => [w.id, w]));
            return {
              ...d,
              widgets: widgetIds
                .map((id) => widgetMap.get(id))
                .filter((w): w is DashboardWidget => w !== undefined),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },
    }),
    {
      name: 'custom-dashboards-storage',
    }
  )
);
