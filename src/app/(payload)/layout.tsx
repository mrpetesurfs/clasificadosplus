import React from 'react'
import config from '@payload-config'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './admin/importMap.js'

type Args = {
  children: React.ReactNode
}

const Layout = async ({ children }: Args) => RootLayout({ children, config, importMap })

export default Layout
