'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface GuideStep {
  id: string
  orderIndex: number
  selector: string
  contentMarkdown: string
  placement: string
  routePath: string | null
  metaJson: string | null
}

interface Guide {
  id: string
  name: string
  key: string
  description: string | null
  steps: GuideStep[]
}

export default function GuideDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [guide, setGuide] = useState<Guide | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingStep, setEditingStep] = useState<GuideStep | null>(null)
  const [showStepForm, setShowStepForm] = useState(false)
  const [stepFormData, setStepFormData] = useState({
    selector: '',
    contentMarkdown: '',
    placement: 'bottom',
    routePath: '',
    metaJson: '',
  })

  useEffect(() => {
    fetchGuide()
  }, [])

  const fetchGuide = async () => {
    try {
      const res = await fetch(`/api/admin/guides/${params.id}`)
      const data = await res.json()
      setGuide(data)
    } catch (error) {
      console.error('Error fetching guide:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateStep = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/guides/${params.id}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepFormData),
      })
      if (res.ok) {
        setStepFormData({
          selector: '',
          contentMarkdown: '',
          placement: 'bottom',
          routePath: '',
          metaJson: '',
        })
        setShowStepForm(false)
        fetchGuide()
      }
    } catch (error) {
      console.error('Error creating step:', error)
    }
  }

  const handleUpdateStep = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStep) return

    try {
      const res = await fetch(`/api/admin/steps/${editingStep.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stepFormData),
      })
      if (res.ok) {
        setEditingStep(null)
        setStepFormData({
          selector: '',
          contentMarkdown: '',
          placement: 'bottom',
          routePath: '',
          metaJson: '',
        })
        fetchGuide()
      }
    } catch (error) {
      console.error('Error updating step:', error)
    }
  }

  const handleDeleteStep = async (stepId: string) => {
    if (!confirm('Are you sure you want to delete this step?')) return

    try {
      await fetch(`/api/admin/steps/${stepId}`, { method: 'DELETE' })
      fetchGuide()
    } catch (error) {
      console.error('Error deleting step:', error)
    }
  }

  const startEditingStep = (step: GuideStep) => {
    setEditingStep(step)
    setStepFormData({
      selector: step.selector,
      contentMarkdown: step.contentMarkdown,
      placement: step.placement,
      routePath: step.routePath || '',
      metaJson: step.metaJson || '',
    })
    setShowStepForm(true)
  }

  const moveStep = async (stepId: string, currentIndex: number, direction: 'up' | 'down') => {
    if (!guide) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= guide.steps.length) return

    try {
      // Update the step being moved
      await fetch(`/api/admin/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIndex: newIndex }),
      })

      // Update the step being swapped with
      const otherStep = guide.steps[newIndex]
      await fetch(`/api/admin/steps/${otherStep.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIndex: currentIndex }),
      })

      fetchGuide()
    } catch (error) {
      console.error('Error moving step:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p>Guide not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="text-blue-600 hover:underline">
            ← Back to Guides
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{guide.name}</h1>
          <p className="text-sm text-gray-500 mt-1">Key: {guide.key}</p>
          {guide.description && (
            <p className="text-gray-600 mt-2">{guide.description}</p>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Steps</h2>
          <div className="flex gap-2">
            <Link
              href={`/preview/${guide.key}`}
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Preview
            </Link>
            <button
              onClick={() => {
                setEditingStep(null)
                setStepFormData({
                  selector: '',
                  contentMarkdown: '',
                  placement: 'bottom',
                  routePath: '',
                  metaJson: '',
                })
                setShowStepForm(true)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Step
            </button>
          </div>
        </div>

        {showStepForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold mb-4">
              {editingStep ? 'Edit Step' : 'Create New Step'}
            </h3>
            <form onSubmit={editingStep ? handleUpdateStep : handleCreateStep} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSS Selector
                </label>
                <input
                  type="text"
                  required
                  value={stepFormData.selector}
                  onChange={(e) => setStepFormData({ ...stepFormData, selector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., #welcome-section"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (Markdown)
                </label>
                <textarea
                  required
                  value={stepFormData.contentMarkdown}
                  onChange={(e) => setStepFormData({ ...stepFormData, contentMarkdown: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  rows={6}
                  placeholder="# Welcome&#10;This is your first step..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placement
                  </label>
                  <select
                    value={stepFormData.placement}
                    onChange={(e) => setStepFormData({ ...stepFormData, placement: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="top">Top</option>
                    <option value="right">Right</option>
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Route Path (optional)
                  </label>
                  <input
                    type="text"
                    value={stepFormData.routePath}
                    onChange={(e) => setStepFormData({ ...stepFormData, routePath: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., /dashboard"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta JSON (optional)
                </label>
                <textarea
                  value={stepFormData.metaJson}
                  onChange={(e) => setStepFormData({ ...stepFormData, metaJson: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  rows={2}
                  placeholder='{"key": "value"}'
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {editingStep ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStepForm(false)
                    setEditingStep(null)
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {guide.steps.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <p className="text-gray-500">No steps yet. Add your first step to get started!</p>
            </div>
          ) : (
            guide.steps.map((step, index) => (
              <div key={step.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                        Step {index + 1}
                      </span>
                      <span className="text-sm text-gray-500">{step.placement}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Selector:</strong> {step.selector}
                    </p>
                    {step.routePath && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Route:</strong> {step.routePath}
                      </p>
                    )}
                    <div className="bg-gray-50 p-3 rounded border border-gray-200 mt-2">
                      <pre className="text-sm whitespace-pre-wrap">{step.contentMarkdown}</pre>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => moveStep(step.id, index, 'up')}
                      disabled={index === 0}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveStep(step.id, index, 'down')}
                      disabled={index === guide.steps.length - 1}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => startEditingStep(step)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStep(step.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
