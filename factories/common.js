const pareto = require('stochastic').pareto;

export function randomSublist(list, count) {
  return list.map((it) => {
    return {
      rand: Math.random(),
      val: it,
    };
  }).sort((a, b) => b.rand - a.rand)
  .map((it) => it.val)
  .slice(0, count);
}

export function randomSet(max, count) {
  return randomSublist(new Array(max).fill(0).map((v, idx) => idx + 1), count);
}

export function toRichText(txt) {
  return {
    ops: [{
      insert: txt,
    }],
  };
}

export function getRandomPareto(alpha) {
  return Math.floor(pareto(0.9, alpha || 1));
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
