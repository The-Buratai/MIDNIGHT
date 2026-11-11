/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, test, vi } from 'vitest'

import { AppHeader } from '../app-header'
import { PublicHeader } from '../public-header'
import { SystemBrand } from '../system-brand'

vi.mock('@/components/config-drawer', () => ({ ConfigDrawer: () => null }))
vi.mock('@/components/language-switcher', () => ({
  LanguageSwitcher: () => null,
}))
vi.mock('@/components/notification-popover', () => ({
  NotificationPopover: () => null,
}))
vi.mock('@/components/profile-dropdown', () => ({
  ProfileDropdown: () => null,
}))
vi.mock('@/components/search', () => ({ Search: () => null }))
vi.mock('@/components/theme-switch', () => ({ ThemeSwitch: () => null }))
vi.mock('@/components/dialog', () => ({ Dialog: () => null }))
vi.mock('@/components/ui/sidebar', () => ({
  SidebarMenu: (props: { children: ReactNode }) => <div>{props.children}</div>,
  SidebarMenuButton: (props: { children: ReactNode }) => (
    <div>{props.children}</div>
  ),
  SidebarMenuItem: (props: { children: ReactNode }) => (
    <div>{props.children}</div>
  ),
  SidebarTrigger: () => null,
}))
vi.mock('@/components/layout/components/header', () => ({
  Header: (props: { children: ReactNode }) => <header>{props.children}</header>,
}))
vi.mock('@/components/layout/components/top-nav', () => ({
  TopNav: () => null,
}))
vi.mock('@/components/layout/components/header-logo', () => ({
  HeaderLogo: () => <img alt='logo' />,
}))
vi.mock('@/hooks/use-notifications', () => ({
  useNotifications: () => ({
    popoverOpen: false,
    setPopoverOpen: vi.fn(),
    unreadCount: 0,
    activeTab: 'all',
    setActiveTab: vi.fn(),
    notice: null,
    announcements: [],
    loading: false,
  }),
}))
vi.mock('@/hooks/use-top-nav-links', () => ({ useTopNavLinks: () => [] }))
vi.mock('@/hooks/use-status', () => ({
  useStatus: () => ({
    status: { system_name: 'System name', version: 'v9.8.7' },
  }),
}))
vi.mock('@/hooks/use-system-config', () => ({
  useSystemConfig: () => ({
    systemName: 'System name',
    logo: '',
    loading: false,
    logoLoaded: true,
  }),
}))
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: () => ({ auth: { user: null } }),
}))
vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    Link: (props: { to: string; children?: ReactNode }) => (
      <a href={props.to}>{props.children}</a>
    ),
    useNavigate: () => vi.fn(),
    useRouterState: () => ({ location: { pathname: '/' } }),
  }
})

describe('application headers', () => {
  test('does not show the running version link in the authenticated header', () => {
    render(<AppHeader showTopNav={false} showSearch={false} />)

    expect(
      screen.queryByRole('button', { name: /System updates, current version/ })
    ).not.toBeInTheDocument()
  })

  test('does not show the running version link in the public header', () => {
    render(<PublicHeader showNotifications={false} />)

    expect(
      screen.queryByRole('button', { name: /System updates, current version/ })
    ).not.toBeInTheDocument()
  })

  test('does not show the running version in the sidebar brand', () => {
    render(<SystemBrand />)

    expect(screen.getByText('System name')).toBeInTheDocument()
    expect(screen.queryByText('v9.8.7')).not.toBeInTheDocument()
  })
})
