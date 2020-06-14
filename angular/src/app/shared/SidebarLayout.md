Description
-------------------
'Toggle to Sidebar Layout' button

![Screenshot-1](../examples/sidebar-layout.jpg)

Example
-------------------
button code:
```html
<h1>
    <a href="/v2#/dashboard/inner-test">
    LINK TO SEE SIDEBAR LAYOUT
    </a>
</h1>
```


routes:
```typescript
{
    path: 'inner-test',
    component: SidebarLayoutComponent,
    canActivate: [RedirectToAuthGuard],
    loadChildren: './dashboard-layout-test/dashboard-layout-test.module#DashboardTestModule'
}
```
