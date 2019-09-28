// @flow
const _ = require('lodash');
const print = require('terminal-kit').realTerminal ;
const findRoots = require('./durandKerner');

const inputEquations = '8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0';

const parseTerm = (equations) => {
  // ((?<2>[+-])?(?:(?:(?<3>\d+)(?<4>x)|(?<5>\d+)|(?<6>x))(?:\^(?<7>\d+))?))
  const re = /((?:([+-])+)?(?:(?:(\d*\.?\d*)(X)|(\d+)|(X))(?:\^(\d+))?))/g
  const terms = [];
  let match = re.exec(equations);
  const eqIndex = _.findIndex(_.split(equations, ''), (c) => c === '=');
  while (match != null) {
    const sign = (match[2] === '-' ? -1 : 1) * (eqIndex < match.index ? -1 : 1);
    const x = match[4] || match[6];
    const degree = match[7] === undefined ? 1 : parseFloat(match[7]);
    const coef1 = match[3] === '' || match[3] === undefined ? 1 : parseFloat(match[3]);
    const coef2 = match[5] === '' || match[5] === undefined ? 1 : parseFloat(match[5]);
    const coef = coef1 * coef2
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
  const orderedTerm = _.orderBy(terms, ['degree'], ['desc']);
  _.map(orderedTerm, ({ coef, degree }, index/* : string */) => {
    const powerChar = '^';
    const sign = coef >= 0 ? '+': '-';
    print('%s %f * X%s%d ', sign, Math.abs(coef), powerChar, degree)
  });
  print('= 0\n');
};

print('%s\n', inputEquations);
const normalized = _.replace(_.replace(inputEquations, / /g, ''), /\*/g, '');
const terms = parseTerm(normalized);
const reducedTerms = reduceTerms(terms);
printTerm(terms);
printTerm(reducedTerms);
console.log(reducedTerms);
const maxDegree = _.last(_.map(reducedTerms)).degree;
const coefs = _.map(new Array(maxDegree + 1), (x, index) => reducedTerms[index] ? reducedTerms[index].coef : 0);
var roots = findRoots(coefs)

for(var i=0; i<roots.length; ++i) {
  if (roots[0][i]) console.log(roots[0][i])
}