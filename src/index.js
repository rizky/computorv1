const _ = require('lodash');

// ((?<2>[+-])?(?:(?:(?<3>\d+)(?<4>x)|(?<5>\d+)|(?<6>x))(?:\^(?<7>\d+))?))
const re = /((?:([+-]) +)?(?:(?:(\d+)(X)|(\d+)|(X))(?:\^(\d+))?))/g

const equations = '5 + 4X + X^2= X^2';

let match = re.exec(equations);
const eqIndex = _.findIndex(equations, (c) => c === '=');

const terms = [];
while (match != null) {
  const sign = (match[2] === '-' ? -1 : 1) * (eqIndex < match.index ? -1 : 1);
  const x = match[4] || match[6];
  terms.push({
    coef: (match[3] || match[5] || 1) * sign,
    degree: x ? (match[7] || 1) : 0,
    match: match[0],
  });
  match = re.exec(equations);
}

console.log(terms);
