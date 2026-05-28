import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    icon: '📝',
    title: 'Comprehensive Editing',
    description:
      'Rich text formatting, headings, lists, tables, images, page margins — everything needed for production-grade document creation.',
  },
  {
    icon: '🎨',
    title: 'Tailored Customization',
    description:
      'Customize toolbar, colors, fonts, and editor chrome to match your application. Style every component the way you want.',
  },
  {
    icon: '⚛️',
    title: 'Seamless React Integration',
    description:
      'Drop-in React component with first-class hooks, refs, and event handlers. Works with any React stack.',
  },
  {
    icon: '📄',
    title: 'Multi-Page Like Google Docs',
    description:
      'Native multi-page support with automatic pagination, page breaks, headers and footers — out of the box.',
  },
  {
    icon: '⌨️',
    title: 'DOM Event Handlers',
    description:
      'Programmatic control over selection, content, and toolbar state via DOMEventHandlers API.',
  },
  {
    icon: '🚀',
    title: 'Production Ready',
    description:
      'Battle-tested, TypeScript-friendly, and published on npm as @mindfiredigital/canvas-editor.',
  },
];

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4', styles.card)}>
      <div className={styles.cardInner}>
        <div className={styles.iconWrap}>
          <span className={styles.icon}>{icon}</span>
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>WHY REACT CANVAS EDITOR</span>
            <h2 className={styles.sectionTitle}>
              Everything you need to ship a document editor.
            </h2>
            <p className={styles.sectionSubtitle}>
              Built for speed, designed for customization. The middle ground
              between rigid frameworks and unstyled primitives.
            </p>
          </div>
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className="container">
          <div className="row">
            <div className={clsx('col col--4', styles.statCol)}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>Open Source</div>
            </div>
            <div className={clsx('col col--4', styles.statCol)}>
              <div className={styles.statValue}>v1.3.0</div>
              <div className={styles.statLabel}>Latest on npm</div>
            </div>
            <div className={clsx('col col--4', styles.statCol)}>
              <div className={styles.statValue}>React 18+</div>
              <div className={styles.statLabel}>Modern stack</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
