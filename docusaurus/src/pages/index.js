import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.hero)}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={clsx('container', styles.heroInner)}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} /> v1.3.0 now on npm
        </span>
        <h1 className={styles.heroTitle}>
          Craft <span className={styles.gradientText}>multi-page documents</span>
          <br /> right inside your React app.
        </h1>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.ctaRow}>
          <Link
            className={clsx('button button--primary button--lg', styles.cta)}
            to="/docs/Get-started/quickstart">
            Get Started →
          </Link>
          <Link
            className={clsx('button button--secondary button--lg', styles.cta)}
            href="https://github.com/mindfiredigital/react-canvas-editor">
            View on GitHub
          </Link>
        </div>
        <div className={styles.installBox}>
          <span className={styles.installPrompt}>$</span>
          <code className={styles.installCmd}>
            npm install @mindfiredigital/canvas-editor
          </code>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="A powerful, customizable React-based document editor for multi-page document creation.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
