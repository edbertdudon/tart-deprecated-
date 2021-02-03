import { tf } from './locale';

const charts = [
  // One variable
  {
    key: 'barchart',
    title: tf('barchart'),
    type: 'geom_bar()',
    variables: 1,
    category: 0,
  },
  {
    key: 'areaplot',
    title: tf('areaplot'),
    type: 'geom_area(stat="bin")',
    variables: 1,
    category: 0,
  },
  {
    key: 'density',
    title: tf('density'),
    type: 'geom_density(kernel="gaussian")',
    variables: 1,
    category: 0,
  },
  {
    key: 'dotplot',
    title: tf('dotplot'),
    type: 'geom_dotplot()',
    variables: 1,
    category: 0,
  },
  {
    key: 'freqpoly',
    title: tf('freqpoly'),
    type: 'geom_freqpoly()',
    variables: 1,
    category: 0,
  },
  {
    key: 'histogram',
    title: tf('histogram'),
    type: 'geom_histogram(binwidth=5)',
    variables: 1,
    category: 0,
  },
  // {key: 'Quantile-quantile', type: 'geom_qq(aes(sample= ))', variables: 1},

  // Two variables (continous, continous)
  {
    key: 'jitter',
    title: tf('jitter'),
    type: 'geom_jitter(height=2, weight=2)',
    variables: 2,
    category: 1,
  },
  {
    key: 'point',
    title: tf('point'),
    type: 'geom_point()',
    variables: 2,
    category: 1,
  },
  {
    key: 'quantile',
    title: tf('quantile'),
    type: 'geom_quantile()',
    variables: 2,
    category: 1,
  },
  {
    key: 'rug',
    title: tf('rug'),
    type: 'geom_rug(sides="bl")',
    variables: 2,
    category: 1,
  },
  {
    key: 'smooth',
    title: tf('smooth'),
    type: 'geom_smooth()',
    variables: 2,
    category: 1,
  },
  // {key: 'Text', type: 'geom_text(aes(label= ))', variables: 2},

  // Two variables (discrete, continous)
  // {key: 'Bar chart ()', type: 'geom_col()', variables: 2},
  {
    key: 'boxplot',
    title: tf('boxplot'),
    type: 'geom_boxplot()',
    variables: 2,
    category: 2,
  },
  {
    key: 'dotplot',
    title: tf('dotplot'),
    type: 'geom_dotplot()',
    variables: 2,
    category: 2,
  },
  {
    key: 'violin',
    title: tf('violin'),
    type: 'geom_violin(scale="area")',
    variables: 2,
    category: 2,
  },

  // Two variables (discrete, discrete)
  {
    key: 'count',
    title: tf('count'),
    type: 'geom_count()',
    variables: 4,
    category: 3,
  },

  // Two variables (continous bivariate distribution)
  {
    key: 'bin2d',
    title: tf('bin2d'),
    type: 'geom_bin2d(binwidth=c(0.25,500))',
    variables: 2,
    category: 4,
  },
  {
    key: 'density2d',
    title: tf('density2d'),
    type: 'geom_density2d()',
    variables: 2,
    category: 4,
  },
  {
    key: 'hex',
    title: tf('hex'),
    type: 'geom_hex()',
    variables: 2,
    category: 4,
  },

  // Two variables (continous function)
  {
    key: 'area',
    title: tf('area'),
    type: 'geom_area()',
    variables: 2,
    category: 5,
  },
  {
    key: 'line',
    title: tf('line'),
    type: 'geom_line()',
    variables: 2,
    category: 5,
  },
  {
    key: 'step',
    title: tf('step'),
    type: 'geom_step(direction="hv")',
    variables: 1,
    category: 5,
  },

  // Two variables (visualizing error)
  // {key: 'Crossbar', type: 'geom_crossbar(fatten=2)', variables: 2},
];

export default charts;
