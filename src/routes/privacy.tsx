import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeftIcon } from 'lucide-react'

export const Route = createFileRoute('/privacy')({
  component: Privacy,
})

function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-left text-primary-900 dark:text-primary-100">
      <div>
        <Link
          to="/"
          className="text-primary-600 dark:text-primary-300 flex items-center gap-2 mb-5 bg-primary-50 dark:bg-primary-900 px-4 py-2 rounded-md hover:bg-primary-100 dark:hover:bg-primary-800"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 mt-4">Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          This privacy policy explains how we handle your data when you visit this portfolio website, currently hosted
          at{' '}
          <a href="https://tommywalkie.com" className="text-primary-600 dark:text-primary-300 hover:underline">
            tommywalkie.com
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analytics</h2>
        <p className="mb-4">
          We use Liwan, a privacy-focused analytics service hosted on our server, to collect anonymous usage data. The
          data is publicly available and can be viewed at{' '}
          <a
            href="https://liwan.tommywalkie.com/p/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-300 hover:underline"
          >
            liwan.tommywalkie.com/p/portfolio
          </a>
          .
        </p>
        <h3 className="text-lg font-semibold mb-2">What we collect:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Page visits</li>
          <li>Referrer domain</li>
          <li>Browser type</li>
          <li>Operating system</li>
        </ul>
        <h3 className="text-lg font-semibold mb-2">What we don't collect:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>IP addresses (only used temporarily for generating anonymous visitor IDs)</li>
          <li>Personal information</li>
          <li>Cookies or persistent identifiers</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Contact</h2>
        <p>
          For privacy-related questions, you can reach out via{' '}
          <a
            href="https://github.com/tommywalkie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 dark:text-primary-300 hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </section>
    </div>
  )
}
