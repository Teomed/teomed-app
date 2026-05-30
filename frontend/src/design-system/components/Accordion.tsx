import React, { useState } from 'react';

export interface AccordionItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

/**
 * Accordion component - preserves exact original styling and behavior from design-system.html
 * Uses original class names: accordion, accordion__item, accordion__item-button, accordion__item-content
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section
      className={`accordion accordion--max-width is-accordion is-initialized ${className}`.trim()}
      data-disableshowmore="1"
    >
      <div className="accordion__content">
        {items.map((item) => {
          const isExpanded = expandedItems.has(item.id);
          return (
            <div key={item.id} className="accordion__item">
              <button
                className="accordion__item-button js-accordion-trigger is-accordion-trigger"
                aria-expanded={isExpanded}
                onClick={() => toggleItem(item.id)}
                tabIndex={0}
              >
                {item.question}
              </button>
              <div
                className="accordion__item-content js-accordion-panel is-accordion-panel"
                aria-hidden={!isExpanded}
                hidden={!isExpanded}
                style={{ height: isExpanded ? 'auto' : '0px' }}
              >
                {typeof item.answer === 'string' ? <p>{item.answer}</p> : item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
