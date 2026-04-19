export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-8 text-center text-sm text-zinc-500">
      <p>
        Site by{' '}
        <a
          href="https://smallbusiness-seo.com"
          rel="noopener"
          target="_blank"
          className="underline hover:text-zinc-900"
        >
          Small Business SEO
        </a>
      </p>
      <p className="mt-1 text-xs">
        © {new Date().getFullYear()} Clasificados Plus. All rights reserved.
      </p>
    </footer>
  )
}
