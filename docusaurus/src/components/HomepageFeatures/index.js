import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Comprehensive Document Editing',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Unlock extensive document editing capabilities with our Canvas document editor. Ideal for developers seeking versatile document editing features.
      </>
    ),
  },
  {
    title: 'Tailored Customization',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Easily customize the UI and functionality to match your application's unique needs. Seamlessly integrate this package into diverse projects.
      </>
    ),
  },
  {
    title: 'Seamless React Integration',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Built on Canvas and React, our document editor ensures a smooth and intuitive user experience. Perfect for effortless integration into React applications.
      </>
    ),
  },
  {
    title: 'Multi-Page Documents Like Google Docs',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Create and manage multi-page documents with ease, just like in Google Docs. Enjoy a seamless and efficient document editing experience.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col')}>
      {/* <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div> */}
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
