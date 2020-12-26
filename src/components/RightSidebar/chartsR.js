const charts = [
  // One variable
  {
    key: 'Bar chart',
    title: 'Bar chart',
    type: 'geom_bar()',
    variables: 1,
    category: 0
  },
  {
    key: 'Area plot',
    title: 'Area plot',
    type: 'geom_area(stat="bin")',
    variables: 1,
    category: 0
  },
  {
    key: 'Smoothed density estimates',
    title: 'Smoothed density estimates',
    type: 'geom_density(kernel="gaussian")',
    variables: 1,
    category: 0
  },
  {
    key: 'Dot plot',
    title: 'Dot plot',
    type: 'geom_dotplot()',
    variables: 1,
    category: 0
  },
  {
    key: 'Frequency polygons',
    title: 'Frequency polygons',
    type: 'geom_freqpoly()',
    variables: 1,
    category: 0
  },
  {
    key: 'Histogram',
    title: 'Histogram',
    type: 'geom_histogram(binwidth=5)',
    variables: 1,
    category: 0
  },
  // {key: 'Quantile-quantile', type: 'geom_qq(aes(sample= ))', variables: 1},

  // Two variables (continous, continous)
  {
    key: 'Jittered points',
    title: 'Jittered points',
    type: 'geom_jitter(height=2, weight=2)',
    variables: 2,
    category: 1
  },
  {
    key: 'Points',
    title: 'Points',
    type: 'geom_point()',
    variables: 2,
    category: 1
  },
  {
    key: 'Quantile regression',
    title: 'Quantile regression',
    type: 'geom_quantile()',
    variables: 2,
    category: 1
  },
  {
    key: 'Rug plots in the margins',
    title: 'Rug plots in the margins',
    type: 'geom_rug(sides="bl")',
    variables: 2,
    category: 1
  },
  {
    key: 'Smoothed conditonal means',
    title: 'Smoothed conditonal means',
    type: 'geom_smooth()',
    variables: 2,
    category: 1
  },
  // {key: 'Text', type: 'geom_text(aes(label= ))', variables: 2},

  // Two variables (discrete, continous)
  // {key: 'Bar chart ()', type: 'geom_col()', variables: 2},
  {
    key: 'Box plot',
    title: 'Box plot',
    type: 'geom_boxplot()',
    variables: 2,
    category: 2
  },
  {
    key: 'Dot plot',
    title: 'Dot plot',
    type: 'geom_dotplot()',
    variables: 2,
    category: 2
  },
  {
    key: 'Violin',
    title: 'Violin',
    type: 'geom_violin(scale="area")',
    variables: 2,
    category: 2
  },

  // Two variables (discrete, discrete)
  {
    key: 'Count overlapping points',
    title: 'Count overlapping points',
    type: 'geom_count()',
    variables: 4,
    category: 3
  },

  // Two variables (continous bivariate distribution)
  {
    key: 'Heatmap of 2d bin counts',
    title: 'Heatmap of 2d bin counts',
    type: 'geom_bin2d(binwidth=c(0.25,500))',
    variables: 2,
    category: 4
  },
  {
    key: 'Contours of a density estimate',
    title: 'Contours of a density estimate',
    type: 'geom_density2d()',
    variables: 2,
    category: 4
  },
  {
    key: 'Hexagonal heatmap of 2d bin counts',
    title: 'Hexagonal heatmap of 2d bin counts',
    type: 'geom_hex()',
    variables: 2,
    category: 4
  },

  // Two variables (continous function)
  {
    key: 'Area (continous function)',
    title: 'Area (continous function)',
    type: 'geom_area()',
    variables: 2,
    category: 5
  },
  {
    key: 'Line',
    title: 'Line',
    type: 'geom_line()',
    variables: 2,
    category: 5
  },
  {
    key: 'Stairstep',
    title: 'Stairstep', 
    type: 'geom_step(direction="hv")',
    variables: 1,
    category: 5
  },

  // Two variables (visualizing error)
  // {key: 'Crossbar', type: 'geom_crossbar(fatten=2)', variables: 2},
]

export default charts
