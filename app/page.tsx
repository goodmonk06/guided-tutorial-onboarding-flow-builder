import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Guided Onboarding Flow Builder
          </h1>
          <p className="text-xl text-gray-600">
            Create interactive step-by-step tutorials for your web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Admin Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Admin Panel
            </h2>
            <p className="text-gray-600 mb-6">
              Create and manage guided tutorials. Define steps, target elements with CSS selectors, and preview your guides.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Go to Admin Panel
            </Link>
          </div>

          {/* Demo Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Live Demo
            </h2>
            <p className="text-gray-600 mb-6">
              See the widget in action! Experience a sample onboarding tour on a demo application.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Try the Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-1">Target Elements</h3>
              <p className="text-sm text-gray-600">Use CSS selectors to highlight any element on your page</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <h3 className="font-semibold text-gray-900 mb-1">Markdown Content</h3>
              <p className="text-sm text-gray-600">Write rich content with markdown formatting</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h3 className="font-semibold text-gray-900 mb-1">Easy Integration</h3>
              <p className="text-sm text-gray-600">Simple JavaScript snippet for any web app</p>
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="mt-8 bg-gray-900 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Quick Start
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
            <li>Create a guide in the Admin Panel</li>
            <li>Add steps with CSS selectors and content</li>
            <li>Get your guide key (e.g., "demo-app-tour")</li>
            <li>Add the widget script to your app</li>
          </ol>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-green-400">{`<script src="/widget.js"></script>
<script>
  OnboardingWidget.init({
    guideKey: 'your-guide-key',
    apiBaseUrl: 'https://your-api.com'
  });
</script>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
