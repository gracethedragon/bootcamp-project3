import './styles.scss';
import React from 'react';
import { render } from 'react-dom';
import data from './bugFile.json';

const jsxListItems = data.bugs.map((bug) => (
  <li>
    <p>
      id:
      {bug.id}
    </p>
    <p>
      problem:
      {bug.problem}
    </p>
    <p>
      error text:
      {bug.errorText}
    </p>
    <p>
      created:
      {bug.createdAt}
    </p>
    <p>
      updated:
      {bug.updatedAt}
    </p>
    <p>
      user email:
      {bug.User.email}
    </p>
    <p>
      feature:
      {bug.Feature.name}
    </p>
  </li>
));

const myEl = (
  <ul>
    {jsxListItems}
  </ul>
);

const rootElement = document.createElement('div');

document.body.appendChild(rootElement);

render(myEl, rootElement);
