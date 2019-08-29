// @flow
const _ = require('lodash');
const print = require('terminal-kit').realTerminal ;

const inputEquations = '5 + 4X + X^2 = X^2 + 4 + 1X^1';

const parseTerm = (equations) => {
  // ((?<2>[+-])?(?:(?:(?<3>\d+)(?<4>x)|(?<5>\d+)|(?<6>x))(?:\^(?<7>\d+))?))
  const re = /((?:([+-]) +)?(?:(?:(\d+)(X)|(\d+)|(X))(?:\^(\d+))?))/g
  const terms = [];
  let match = re.exec(equations);
  const eqIndex = _.findIndex(_.split(equations, ''), (c) => c === '=');
  while (match != null) {
    const sign = (match[2] === '-' ? -1 : 1) * (eqIndex < match.index ? -1 : 1);
    const x = match[4] || match[6];
    const degree = match[7] ? parseInt(match[7]) : 1;
    const coef1 = match[3] ? parseInt(match[3]) : null;
    const coef2 = match[5] ? parseInt(match[5]) : null
    const coef = (coef1 === null && coef2 === null) ? 1 : parseInt(coef1 || coef2)
    terms.push({
      coef: coef * sign,
      degree: x ? degree : 0,
      match: match[0],
    });
    match = re.exec(equations);
  }
  return terms;;
}

const reduceTerms = (terms) => _.reduce(terms, (acc, term) => {
  const { coef: prevCoef = 0 } = acc[term.degree] || {};
  const { coef } = term;
  const nextTerm = { coef: prevCoef + coef, degree: term.degree };
  if (nextTerm.coef === 0) return _.omit(acc, _.toString(term.degree));
  return { ...acc, [term.degree]: nextTerm };
}, {});

const printTerm = (terms) => {
  _.map(terms, ({ coef, degree }, index/* : string */) => {
    if (parseInt(index) > 0) {
      if (coef > 0) print('+ '); else print('- ');
    }
    const absCoef = Math.abs(coef);
    if (absCoef > 0) print('%d', absCoef)
    if (degree === 1) print('X ');
    if (degree > 1) print('%s%d ', '^', degree);
    if (degree === 0) print(' ');
  });
  print('= 0\n');
};

print('%s\n', inputEquations);
const terms = parseTerm(inputEquations);
const reducedTerms = reduceTerms(terms);
printTerm(terms);
printTerm(reducedTerms);
console.log(reducedTerms);