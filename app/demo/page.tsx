'use client'

import { useEffect, useState } from 'react'

export default function DemoPage() {
  const [guideStarted, setGuideStarted] = useState(false)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    // Set origin for code example
    setOrigin(window.location.origin)

    // Load the widget script
    const script = document.createElement('script')
    script.src = '/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  const startGuide = () => {
    if ((window as any).OnboardingWidget) {
      (window as any).OnboardingWidget.init({
        guideKey: 'demo-app-tour',
        apiBaseUrl: window.location.origin,
        onComplete: () => {
          setGuideStarted(false)
          alert('Tour completed! Thanks for checking it out.')
        },
      })
      setGuideStarted(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Demo App</h1>
            <button
              onClick={startGuide}
              disabled={guideStarted}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {guideStarted ? 'Tour Running...' : 'Start Tour'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8" id="welcome-section">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Our Demo App
          </h2>
          <p className="text-lg text-gray-600">
            This is a demo application showcasing the onboarding widget.
            Click the "Start Tour" button above to begin the guided tutorial.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Feature One */}
          <div className="bg-white rounded-xl shadow-lg p-8" id="feature-one">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Feature One
            </h3>
            <p className="text-gray-600">
              This is an amazing feature that helps you accomplish tasks quickly and efficiently.
              Our guided tour will explain how to use it.
            </p>
          </div>

          {/* Feature Two */}
          <div className="bg-white rounded-xl shadow-lg p-8" id="feature-two">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Feature Two
            </h3>
            <p className="text-gray-600">
              Another powerful feature designed to enhance your experience.
              The tour will guide you through its capabilities step by step.
            </p>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Customize Your Experience
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Notifications</h4>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Dark Mode</h4>
                <p className="text-sm text-gray-600">Toggle dark mode theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button
              id="settings-button"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Open Settings Panel
            </button>
          </div>
        </div>

        {/* Integration Code Example */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            Integration Example
          </h3>
          <p className="text-gray-300 mb-4">
            To integrate this widget into your own app, simply add:
          </p>
          <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
            <code className="text-sm text-green-400">{origin ? `<!-- Add this to your HTML -->
<script src="${origin}/widget.js"></script>

<!-- Initialize the widget -->
<script>
  OnboardingWidget.init({
    guideKey: 'demo-app-tour',
    apiBaseUrl: '${origin}',
    onComplete: function() {
      console.log('Tour completed!');
    }
  });
</script>` : '<!-- Loading... -->'}</code>
          </pre>
        </div>
      </main>
    </div>
  )
}
