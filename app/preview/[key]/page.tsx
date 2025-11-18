'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PreviewPage() {
  const params = useParams()

  useEffect(() => {
    // Load the widget script
    const script = document.createElement('script')
    script.src = '/widget.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Initialize the guide once the script is loaded
      if ((window as any).OnboardingWidget) {
        (window as any).OnboardingWidget.init({
          guideKey: params.key,
          apiBaseUrl: window.location.origin,
        })
      }
    }

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [params.key])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" id="welcome-section">
          Preview Mode
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6" id="feature-one">
          <h2 className="text-2xl font-semibold mb-4">Feature One</h2>
          <p className="text-gray-600">
            This is a demo section that represents Feature One in your application.
            The guided tour will highlight this section and show relevant information.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6" id="feature-two">
          <h2 className="text-2xl font-semibold mb-4">Feature Two</h2>
          <p className="text-gray-600">
            This is another demo section representing Feature Two. You can create
            steps that point to different elements on your page.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <button
            id="settings-button"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  )
}
