// Page components (CustomersPage, ComponentPreview, auth pages) are lazy-loaded
// in router.tsx and intentionally not re-exported here — a static re-export would
// pull them into the main bundle and defeat code-splitting.
export * from './auth'
export * from './layouts'
export * from './router'
