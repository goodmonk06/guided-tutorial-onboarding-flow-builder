(function() {
  'use strict';

  // Marked.js - Simple markdown parser (inline version)
  function parseMarkdown(md) {
    // Simple markdown parser for basic formatting
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Line breaks
      .replace(/\n/g, '<br>');

    return html;
  }

  const OnboardingWidget = {
    config: null,
    guide: null,
    currentStepIndex: 0,
    elements: {
      overlay: null,
      tooltip: null,
      highlight: null,
    },

    init: function(config) {
      this.config = {
        guideKey: config.guideKey,
        apiBaseUrl: config.apiBaseUrl || '',
        onComplete: config.onComplete || function() {},
      };

      this.loadGuide();
    },

    loadGuide: async function() {
      try {
        const url = `${this.config.apiBaseUrl}/api/guides/${this.config.guideKey}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.error('Failed to load guide:', response.statusText);
          return;
        }

        this.guide = await response.json();

        if (this.guide.steps && this.guide.steps.length > 0) {
          this.createOverlay();
          this.showStep(0);
        }
      } catch (error) {
        console.error('Error loading guide:', error);
      }
    },

    createOverlay: function() {
      // Create backdrop
      const backdrop = document.createElement('div');
      backdrop.id = 'onboarding-backdrop';
      backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        transition: opacity 0.3s;
      `;

      // Create highlight element
      const highlight = document.createElement('div');
      highlight.id = 'onboarding-highlight';
      highlight.style.cssText = `
        position: absolute;
        border: 3px solid #3b82f6;
        border-radius: 8px;
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        z-index: 9999;
        pointer-events: none;
        transition: all 0.3s ease;
      `;

      // Create tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'onboarding-tooltip';
      tooltip.style.cssText = `
        position: absolute;
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 400px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      document.body.appendChild(backdrop);
      document.body.appendChild(highlight);
      document.body.appendChild(tooltip);

      this.elements.overlay = backdrop;
      this.elements.highlight = highlight;
      this.elements.tooltip = tooltip;

      // Click backdrop to close
      backdrop.addEventListener('click', () => this.close());
    },

    showStep: function(index) {
      if (!this.guide || !this.guide.steps || index >= this.guide.steps.length) {
        return;
      }

      this.currentStepIndex = index;
      const step = this.guide.steps[index];

      // Find the target element
      const targetElement = document.querySelector(step.selector);

      if (!targetElement) {
        console.warn(`Element not found for selector: ${step.selector}`);
        return;
      }

      // Position highlight around target element
      this.positionHighlight(targetElement);

      // Position and populate tooltip
      this.positionTooltip(targetElement, step);
    },

    positionHighlight: function(element) {
      const rect = element.getBoundingClientRect();
      const padding = 8;

      this.elements.highlight.style.top = `${rect.top + window.scrollY - padding}px`;
      this.elements.highlight.style.left = `${rect.left + window.scrollX - padding}px`;
      this.elements.highlight.style.width = `${rect.width + padding * 2}px`;
      this.elements.highlight.style.height = `${rect.height + padding * 2}px`;

      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    positionTooltip: function(element, step) {
      const rect = element.getBoundingClientRect();
      const tooltip = this.elements.tooltip;

      // Populate tooltip content
      const isLastStep = this.currentStepIndex === this.guide.steps.length - 1;

      tooltip.innerHTML = `
        <div style="margin-bottom: 16px;">
          <div style="color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
            Step ${this.currentStepIndex + 1} of ${this.guide.steps.length}
          </div>
          <div style="color: #111827; line-height: 1.6;">
            ${parseMarkdown(step.contentMarkdown)}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
          <button id="onboarding-close" style="
            background: transparent;
            border: none;
            color: #6b7280;
            cursor: pointer;
            font-size: 14px;
            padding: 8px 12px;
          ">Skip</button>
          <div style="display: flex; gap: 8px;">
            ${this.currentStepIndex > 0 ? `
              <button id="onboarding-prev" style="
                background: #e5e7eb;
                border: none;
                border-radius: 6px;
                color: #374151;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                padding: 10px 20px;
              ">Previous</button>
            ` : ''}
            <button id="onboarding-next" style="
              background: #3b82f6;
              border: none;
              border-radius: 6px;
              color: white;
              cursor: pointer;
              font-size: 14px;
              font-weight: 500;
              padding: 10px 20px;
            ">${isLastStep ? 'Finish' : 'Next'}</button>
          </div>
        </div>
      `;

      // Position tooltip based on placement
      const tooltipRect = tooltip.getBoundingClientRect();
      const spacing = 20;
      let top, left;

      switch (step.placement) {
        case 'top':
          top = rect.top + window.scrollY - tooltipRect.height - spacing;
          left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'right':
          top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.right + window.scrollX + spacing;
          break;
        case 'left':
          top = rect.top + window.scrollY + (rect.height / 2) - (tooltipRect.height / 2);
          left = rect.left + window.scrollX - tooltipRect.width - spacing;
          break;
        case 'bottom':
        default:
          top = rect.bottom + window.scrollY + spacing;
          left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);
          break;
      }

      // Ensure tooltip stays within viewport
      const maxLeft = window.innerWidth - tooltipRect.width - 20;
      const maxTop = window.innerHeight + window.scrollY - tooltipRect.height - 20;

      tooltip.style.top = `${Math.max(20, Math.min(top, maxTop))}px`;
      tooltip.style.left = `${Math.max(20, Math.min(left, maxLeft))}px`;

      // Add event listeners
      const closeBtn = document.getElementById('onboarding-close');
      const nextBtn = document.getElementById('onboarding-next');
      const prevBtn = document.getElementById('onboarding-prev');

      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (isLastStep) {
            this.complete();
          } else {
            this.next();
          }
        });
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prev());
      }
    },

    next: function() {
      if (this.currentStepIndex < this.guide.steps.length - 1) {
        this.showStep(this.currentStepIndex + 1);
      }
    },

    prev: function() {
      if (this.currentStepIndex > 0) {
        this.showStep(this.currentStepIndex - 1);
      }
    },

    complete: function() {
      this.close();
      if (this.config.onComplete) {
        this.config.onComplete();
      }
    },

    close: function() {
      if (this.elements.overlay) {
        this.elements.overlay.remove();
      }
      if (this.elements.highlight) {
        this.elements.highlight.remove();
      }
      if (this.elements.tooltip) {
        this.elements.tooltip.remove();
      }

      this.elements = {
        overlay: null,
        tooltip: null,
        highlight: null,
      };
    }
  };

  // Export to global scope
  window.OnboardingWidget = OnboardingWidget;
})();
