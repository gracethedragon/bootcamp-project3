import React from 'react';
import { render } from 'react-dom';
import './styles.scss';

// Create JSX element and log it.
const myEl = <div>Hey Wow!</div>;
console.log('myEl: ', myEl);

// Create root element to render other elements into, add root element to DOM.
const rootElement = document.createElement('div');
document.body.appendChild(rootElement);

// Render the myEl JSX element into the root element with React.
render(myEl, rootElement);