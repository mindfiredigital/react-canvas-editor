import React from 'react';
import { storiesOf } from '@storybook/react';
import { TestFile } from '../components/Test/test';
// import { DocumentEditor } from '../pages/DocumentEditor/DocumentEditor';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
    return <TestFile />;
})