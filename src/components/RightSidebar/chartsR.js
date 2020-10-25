const charts = [
  // One variable
  {name: 'Bar chart', type: 'geom_bar()', variables: 1, category: 0},
  {name: 'Area plot', type: 'geom_area(stat="bin")', variables: 1, category: 0},
  {name: 'Smoothed density estimates', type: 'geom_density(kernel="gaussian")', variables: 1, category: 0},
  {name: 'Dot plot', type: 'geom_dotplot()', variables: 1, category: 0},
  {name: 'Frequency polygons', type: 'geom_freqpoly()', variables: 1, category: 0},
  {name: 'Histogram', type: 'geom_histogram(binwidth=5)', variables: 1, category: 0},
  // {name: 'Quantile-quantile', type: 'geom_qq(aes(sample= ))', variables: 1},

  // Two variables (continous, continous)
  {name: 'Jittered points', type: 'geom_jitter(height=2, weight=2)', variables: 2, category: 1},
  {name: 'Points', type: 'geom_point()', variables: 2, category: 1},
  {name: 'Quantile regression', type: 'geom_quantile()', variables: 2, category: 1},
  {name: 'Rug plots in the margins', type: 'geom_rug(sides="bl")', variables: 2, category: 1},
  {name: 'Smoothed conditonal means', type: 'geom_smooth()', variables: 2, category: 1},
  // {name: 'Text', type: 'geom_text(aes(label= ))', variables: 2},

  // Two variables (discrete, continous)
  // {name: 'Bar chart ()', type: 'geom_col()', variables: 2},
  {name: 'Box plot', type: 'geom_boxplot()', variables: 2, category: 2},
  {name: 'Dot plot', type: 'geom_dotplot()', variables: 2, category: 2},
  {name: 'Violin', type: 'geom_violin(scale="area")', variables: 2, category: 2},

  // Two variables (discrete, discrete)
  {name: 'Count overlapping points', type: 'geom_count()', variables: 4, category: 3},

  // Two variables (continous bivariate distribution)
  {name: 'Heatmap of 2d bin counts', type: 'geom_bin2d(binwidth=c(0.25,500))', variables: 2, category: 4},
  {name: 'Contours of a density estimate', type: 'geom_density2d()', variables: 2, category: 4},
  {name: 'Hexagonal heatmap of 2d bin counts', type: 'geom_hex()', variables: 2, category: 4},

  // Two variables (continous function)
  {name: 'Area (continous function)', type: 'geom_area()', variables: 2, category: 5},
  {name: 'Line', type: 'geom_line()', variables: 2, category: 5},
  {name: 'Stairstep', type: 'geom_step(direction="hv")', variables: 1, category: 5},

  // Two variables (visualizing error)
  // {name: 'Crossbar', type: 'geom_crossbar(fatten=2)', variables: 2},
]

export default charts
