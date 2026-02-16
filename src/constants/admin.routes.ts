export const ADMIN_ROUTES = {
    DASHBOARD: '/admin',
    SHIPMENTS: '/admin/shipments',
    USERS: '/admin/users',
    DRIVERS: '/admin/drivers',
    OFFICES: '/admin/offices',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
};

export const ADMIN_MENU_ITEMS = [
    { label: 'Dashboard', path: ADMIN_ROUTES.DASHBOARD },
    { label: 'Encomiendas', path: ADMIN_ROUTES.SHIPMENTS },
    { label: 'Usuarios', path: ADMIN_ROUTES.USERS },
    { label: 'Conductores', path: ADMIN_ROUTES.DRIVERS },
    { label: 'Oficinas', path: ADMIN_ROUTES.OFFICES },
    { label: 'Reportes', path: ADMIN_ROUTES.REPORTS },
    { label: 'Configuración', path: ADMIN_ROUTES.SETTINGS },
];
