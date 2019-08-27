// @flow
const _ = require('lodash');
const print = require('terminal-kit').realTerminal ;

// ((?<2>[+-])?(?:(?:(?<3>\d+)(?<4>x)|(?<5>\d+)|(?<6>x))(?:\^(?<7>\d+))?))
const re = /((?:([+-]) +)?(?:(?:(\d+)(X)|(\d+)|(X))(?:\^(\d+))?))/g

const equations = '5 + 4X + X^2 = X^2';

let match = re.exec(equations);
const eqIndex = _.findIndex(equations, (c) => c === '=');

const terms = [];
while (match != null) {
  const sign = (match[2] === '-' ? -1 : 1) * (eqIndex < match.index ? -1 : 1);
  const x = match[4] || match[6];
  const degree = match[7] ? parseInt(match[7]) : 1;
  const coef1 = match[3] ? parseInt(match[3]) : null;
  const coef2 = match[5] ? parseInt(match[5]) : null
  const coef = (coef1 === null && coef2 === null) ? 1 : (coef1 || coef2)
  terms.push({
    coef: coef * sign,
    degree: x ? degree : 0,
    match: match[0],
  });
  match = re.exec(equations);
}

const reducedTerms = _.reduce(terms, (acc, term) => {
  const { coef: prevCoef = 0 } = acc[term.degree] || {};
  const { coef } = term;
  const nextTerm = { ...term, coef: prevCoef + coef };
  return { ...acc, [term.degree]: nextTerm };
}, {});

const printTerm = (terms) => {
  _.map(terms, ({ coef, degree }, index) => {
    if (index > 0 && coef !== 0) {
      if (coef > 0) print('+ '); else print('- ');
    }
    if (coef > 1 && degree > 1) print('%dX%s%d ', coef, '^', degree);
    if (coef === 1 && degree > 1) print('X%s%d ', '^', degree);
    else if (coef > 1 && degree == 1) print('%dX ', coef);
    else if (coef == 1 && degree == 1) print('X ', coef);
    else if (coef > 0 && degree <= 0) print('%d ', coef);
  });
  print('= 0\n');
};

print('%s\n', equations);
printTerm(terms);
printTerm(reducedTerms);
