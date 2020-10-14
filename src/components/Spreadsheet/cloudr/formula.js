/**
  formula:
    key
    title
    render
*/
/**
 * @typedef {object} Formula
 * @property {string} key
 * @property {function} title
 * @property {function} render
 */
import { tf } from '../locale/locale';

/** @type {Formula[]} */
const rFormulas = [
	// Math
	{
		key: 'sin',
		title: tf('formula.sin'),
		syntax:'sin(value)',
		description: 'sine in radians'
	},
	{
		key: 'cos',
		title: tf('formula.cos'),
		syntax:'cos(value)',
		description: 'cosine in radians'
	},
	{
		key: 'tan',
		title: tf('formula.tan'),
		syntax:'tan(value)',
		description: 'tangent in radians'
	},
	{
		key: 'asin',
		title: tf('formula.asin'),
		syntax:'asin(value)',
		description: 'arc-sine in radians'
	},
	{
		key: 'acos',
		title: tf('formula.acos'),
		syntax:'acos(value)',
		description: 'arc-cosine in radians'
	},
	{
		key: 'atan',
		title: tf('formula.atan'),
		syntax:'atan(value)',
		description: 'arc-tangent in radians'
	},
	{
		key: 'atan2',
		title: tf('formula.atan2'),
		syntax:'atan2(y,x)',
		description: 'two-argument arc-tangent in radians'
	},
	{
		key: 'log',
		title: tf('formula.log'),
		syntax:'log(value, base)',
		description: 'logarithms, by default natural logarithms'
	},
	{
		key: 'log10',
		title: tf('formula.log10'),
		syntax:'log10(value)',
		description: 'common (i.e., base 10) logarithms'
	},
	{
		key: 'log2',
		title: tf('formula.log2'),
		syntax:'log2(value)',
		description: 'binary (i.e., base 2) logarithms'
	},
	// log1p
	{
		key: 'exp',
		title: tf('formula.exp'),
		syntax:'exp(value)',
		description: 'exponent'
	},
	// expm1
	{
		key: 'max',
		title: tf('formula.max'),
		syntax:'max(value1, [value2, ...])',
		description: 'maximum of the elements'
	},
	{
		key: 'min',
		title: tf('formula.min'),
		syntax:'min(value1, [value2, ...])',
		description: 'minimum of the elements'
	},
	// // {
	// 	key: 'range',
	// 	description: ''
	// },
	{
		key: 'sum',
		title: tf('formula.sum'),
		syntax:'max(value1, [value2, ...])',
		description: 'sum of the elements'
	},
	{
		key: 'diff',
		title: tf('formula.diff'),
		syntax:'diff(value, lag, differences)',
		description: 'lagged and iterated differences of vector'
	},
	{
		key: 'prod',
		title: tf('formula.prod'),
		syntax:'prod(value1, [value2, ...])',
		description: 'product of the elements'
	},
	{
		key: 'mean',
		title: tf('formula.mean'),
		syntax:'mean(value1, [value2, ...])',
		description: 'mean of the elements'
	},
	{
		key: 'median',
		title: tf('formula.median'),
		syntax:'median(value1, [value2, ...])',
		description: 'median of the elements'
	},
	// // {
	// 	key: 'quantile',
	// 	description: 'sample quantiles corresponding to the given probabilities (defaults to 0,.25,.5,.75,1)'
	// },
	{
		key: 'weighted.mean',
		title: tf('formula.weightedmean'),
		syntax:'max(values, weights)',
		description: 'Compute a weighted mean, (values, weights). Values and weights must have the same length.'
	},
	// // {
	// 	key: 'rank',
	// 	description: 'ranks of the elements'
	// },
	{
		key: 'var',
		title: tf('formula.var'),
		syntax:'var(range1, [range2])',
		description: 'variance of the elements (calculated on n − 1)'
	},
	{
		key: 'cov',
		title: tf('formula.cov'),
		syntax:'cov(range1, [range2])',
		description: 'compute the covariance'
	},
	{
		key: 'sd',
		title: tf('formula.sd'),
		syntax:'sd(value1, [value2, ...])',
		description: 'standard deviation'
	},
	{
		key: 'cor',
		title: tf('formula.cor'),
		syntax:'cor(range1, [range2])',
		description: 'compute the correlation'
	},
	{
		key: 'round',
		title: tf('formula.round'),
		syntax:'round(value, digits)',
		description: 'rounds the elements to n decimals'
	},
	// // {
	// 	key: 'scale',
	// 	description: ''
	// },
	{
		key: 'pmin',
		title: tf('formula.pmin'),
		syntax:'pmin(value1, [value2, ...])',
		description: 'a vector which ith element is the minimum'
	},
	{
		key: 'pmax',
		title: tf('formula.pmax'),
		syntax:'pmax(value1, [value2, ...])',
		description: 'a vector which ith element is the maximum'
	},
	// // {
	// 	key: 'cumsum',
	// 	description: ''
	// },
	// // {
	// 	key: 'cummin',
	// 	description: ''
	// },
	// // {
	// 	key: 'cumax',
	// 	description: ''
	// },
	// // {
	// 	key: 'union',
	// 	description: ''
	// },
	// // {
	// 	key: 'intersect',
	// 	description: ''
	// },
	// // {
	// 	key: 'setdiff',
	// 	description: ''
	// },
	// // {
	// 	key: 'setequal',
	// 	description: ''
	// },
	// // {
	// 	key: 'is.element',
	// 	description: ''
	// },
	// // {
	// 	key: 'Re',
	// 	description: 'real part of a complex number'
	// },
	// // {
	// 	key: 'Im',
	// 	description: 'imaginary part of a complex number'
	// },
	// // {
	// 	key: 'Mod',
	// 	description: 'modulus'
	// },
	// // {
	// 	key: 'abs',
	// 	description: 'modulus'
	// },
	// // {
	// 	key: 'Arg',
	// 	description: 'angle in radians of the complex number'
	// },
	// // {
	// 	key: 'Conj',
	// 	description: 'complex conjugate'
	// },
	// // {
	// 	key: 'convolve',
	// 	description: 'compute the several kinds of convolutions of two sequences, convolve(x,y)'
	// },
	// // {
	// 	key: 'fft',
	// 	description: 'Fast Fourier Transform of an array'
	// },
	// // {
	// 	key: 'mvfft',
	// 	description: 'Fast Fourier Transform of each column of a matrix'
	// },
	// // {
	// 	key: 'filter',
	// 	description: 'applies linear filtering to a univariate time series or to each series separately of a multivariate time series, filter(x,filter)'
	// },

	// Matrices
	{
		key: 't',
		title: tf('formula.t'),
		syntax:'t(range)',
		description: 'Transpose matrix'
	},
	{
		key: 'diag',
		title: tf('formula.diag'),
		syntax:'diag(range)',
		description: 'Diagonal of matrix'
	},
	{
		key: '%*%',
		title: tf('formula.%*%'),
		syntax:'range %*% range',
		description: 'Matrix multiplication'
	},
	{
		key: 'solve',
		title: tf('formula.solve'),
		syntax:'solve(range, range2)',
		description: 'Solves equation range %*% x = range2'
	},
	{
		key: 'solve',
		title: tf('formula.solve'),
		syntax:'solve(range)',
		description: 'Inverse matrix'
	},
	{
		key: 'rowSums',
		title: tf('formula.rowSums'),
		syntax:'rowSums(range)',
		description: 'Sum of matrix rows'
	},
	{
		key: 'colSums',
		title: tf('formula.colSums'),
		syntax:'colSums(range)',
		description: 'Sum of matrix columns'
	},
	{
		key: 'rowMeans',
		title: tf('formula.rowMeans'),
		syntax:'rowMeans(range)',
		description: 'Mean of matrix rows'
	},
	{
		key: 'colMeans',
		title: tf('formula.colMeans'),
		syntax:'colMeans(range)',
		description: 'Mean of matrix columns'
	},

	// Distributions
	{
		key: 'dnorm',
		title: tf('formula.dnorm'),
		syntax:'dnorm(quantile, mean, sd)',
		description: 'Density for the normal distribution'
	},
	{
		key: 'pnorm',
		title: tf('formula.pnorm'),
		syntax:'pnorm(quantile, mean, sd)',
		description: 'Distribution function for the normal distribution'
	},
	{
		key: 'qnorm',
		title: tf('formula.qnorm'),
		syntax:'qnorm(probability, mean, sd)',
		description: 'Quantile function for the normal distribution'
	},
	{
		key: 'rnorm',
		title: tf('formula.rnorm'),
		syntax:'rnorm(mean, sd)',
		description: 'Random generation for the normal distribution',
		addStart: '1,'
	},
	{
		key: 'dexp',
		title: tf('formula.dexp'),
		syntax:'dexp(quantile, rate)',
		description: 'Density for the exponential distribution'
	},
	{
		key: 'pexp',
		title: tf('formula.pexp'),
		syntax:'pexp(quantile, rate)',
		description: 'Distribution function for the exponential distribution'
	},
	{
		key: 'qexp',
		title: tf('formula.qexp'),
		syntax:'qexp(probability, rate)',
		description: 'Quantile function for the exponential distribution'
	},
	{
		key: 'rexp',
		title: tf('formula.rexp'),
		syntax:'rexp(rate)',
		description: 'Random generation for the exponential distribution',
		addStart: '1,'
	},
	{
		key: 'dgamma',
		title: tf('formula.dgamma'),
		syntax:'dgamma(quantile, shape, scale)',
		description: 'Density for the Gamma distribution'
	},
	{
		key: 'pgamma',
		title: tf('formula.pgamma'),
		syntax:'pgamma(quantile, shape, scale)',
		description: 'Distribution function for the Gamma distribution'
	},
	{
		key: 'qgamma',
		title: tf('formula.qgamma'),
		syntax:'qgamma(probability, shape, scale)',
		description: 'Quantile function for the Gamma distribution'
	},
	{
		key: 'rgamma',
		title: tf('formula.rgamma'),
		syntax:'rgamma(shape, scale)',
		description: 'Random generation for the Gamma distribution',
		addStart: '1,'
	},
	{
		key: 'dpois',
		title: tf('formula.dpois'),
		syntax:'dpois(quantile, lambda)',
		description: 'Density for the Poisson distribution'
	},
	{
		key: 'ppois',
		title: tf('formula.ppois'),
		syntax:'ppois(quantile, lambda)',
		description: 'Distribution function for the Poisson distribution'
	},
	{
		key: 'qpois',
		title: tf('formula.qpois'),
		syntax:'qpois(probability, lambda)',
		description: 'Quantile function for the Poisson distribution'
	},
	{
		key: 'rpois',
		title: tf('formula.rpois'),
		syntax:'rpois(lambda)',
		description: 'Random generation for the Poisson distribution',
		addStart: '1,'
	},
	{
		key: 'dweibull',
		title: tf('formula.dweibull'),
		syntax:'dweibull(quantile, shape, scale)',
		description: 'Density for the Weibull distribution'
	},
	{
		key: 'pweibull',
		title: tf('formula.pweibull'),
		syntax:'pweibull(quantile, shape, scale)',
		description: 'Distribution function for the Weibull distribution'
	},
	{
		key: 'qweibull',
		title: tf('formula.qweibull'),
		syntax:'qweibull(probability, shape, scale)',
		description: 'Quantile function for the Weibull distribution'
	},
	{
		key: 'rweibull',
		title: tf('formula.rweibull'),
		syntax:'rweibull(shape, scale)',
		description: 'Random generation for the Weibull distribution',
		addStart: '1,'
	},
	{
		key: 'dcauchy',
		title: tf('formula.dcauchy'),
		syntax:'dcauchy(quantile, location, scale)',
		description: 'Density for the Cauchy distribution'
	},
	{
		key: 'pcauchy',
		title: tf('formula.pcauchy'),
		syntax:'pcauchy(quantile, location, scale)',
		description: 'Distribution function for the Cauchy distribution'
	},
	{
		key: 'qcauchy',
		title: tf('formula.qcauchy'),
		syntax:'qcauchy(probability, location, scale)',
		description: 'Quantile function for the Cauchy distribution'
	},
	{
		key: 'rcauchy',
		title: tf('formula.rcauchy'),
		syntax:'rcauchy(location, scale)',
		description: 'Random generation for the Cauchy distribution',
		addStart: '1,'
	},
	{
		key: 'dbeta',
		title: tf('formula.dbeta'),
		syntax:'dbeta(quantile, shape1, shape2, [non-centrality])',
		description: 'Density for the Beta distribution'
	},
	{
		key: 'pbeta',
		title: tf('formula.pbeta'),
		syntax:'pbeta(quantile, shape1, shape2, [non-centrality])',
		description: 'Distribution function for the Beta distribution'
	},
	{
		key: 'qbeta',
		title: tf('formula.qbeta'),
		syntax:'qbeta(probability, shape1, shape2, [non-centrality])',
		description: 'Quantile function for the Beta distribution'
	},
	{
		key: 'rbeta',
		title: tf('formula.rbeta'),
		syntax:'rbeta(shape1, shape2, [non-centrality])',
		description: 'Random generation for the Beta distribution',
		addStart: '1,'
	},
	{
		key: 'dt',
		title: tf('formula.dt'),
		syntax:'dt(quantile, degrees of freedom, [non-centrality])',
		description: 'Density for the t distribution'
	},
	{
		key: 'pt',
		title: tf('formula.pt'),
		syntax:'pt(quantile, degrees of freedom, [non-centrality])',
		description: 'Distribution function for the t distribution'
	},
	{
		key: 'qt',
		title: tf('formula.qt'),
		syntax:'qt(probability, degrees of freedom, [non-centrality])',
		description: 'Quantile function for the t distribution'
	},
	{
		key: 'rt',
		title: tf('formula.rt'),
		syntax:'rt(degrees of freedom, [non-centrality])',
		description: 'Random generation for the t distribution',
		addStart: '1,'
	},
	{
		key: 'df',
		title: tf('formula.df'),
		syntax:'df(quantile, degrees of freedom1, degrees of freedom2, [non-centrality])',
		description: 'Density for the F distribution'
	},
	{
		key: 'pf',
		title: tf('formula.pf'),
		syntax:'pf(quantile, degrees of freedom1, degrees of freedom2, [non-centrality])',
		description: 'Distribution function for the F distribution'
	},
	{
		key: 'qf',
		title: tf('formula.qf'),
		syntax:'qf(probability, degrees of freedom1, degrees of freedom2, [non-centrality])',
		description: 'Quantile function for the F distribution'
	},
	{
		key: 'rf',
		title: tf('formula.rf'),
		syntax:'rf(degrees of freedom1, degrees of freedom2, [non-centrality])',
		description: 'Random generation for the F distribution',
		addStart: '1,'
	},
	{
		key: 'dbinom',
		title: tf('formula.dbinom'),
		syntax:'dbinom(quantile, number of trials, probability of success)',
		description: 'Density for the binomial distribution'
	},
	{
		key: 'pbinom',
		title: tf('formula.pbinom'),
		syntax:'pbinom(quantile, number of trials, probability of success)',
		description: 'Distribution function for the binomial distribution'
	},
	{
		key: 'qbinom',
		title: tf('formula.qbinom'),
		syntax:'qbinom(probability, number of trials, probability of success)',
		description: 'Quantile function for the binomial distribution'
	},
	{
		key: 'rbinom',
		title: tf('formula.rbinom'),
		syntax:'rbinom(number of trials, probability of success)',
		description: 'Random generation for the binomial distribution',
		addStart: '1,'
	},
	{
		key: 'dgeom',
		title: tf('formula.dgeom'),
		syntax:'dgeom(quantile, probability of success)',
		description: 'Density for the geometric distribution'
	},
	{
		key: 'pgeom',
		title: tf('formula.pgeom'),
		syntax:'pgeom(quantile, probability of success)',
		description: 'Distribution function for the geometric distribution'
	},
	{
		key: 'qgeom',
		title: tf('formula.qgeom'),
		syntax:'qgeom(probability, probability of success)',
		description: 'Quantile function for the geometric distribution'
	},
	{
		key: 'rgeom',
		title: tf('formula.rgeom'),
		syntax:'rgeom(probability of success)',
		description: 'Random generation for the geometric distribution',
		addStart: '1,'
	},
	{
		key: 'dhyper',
		title: tf('formula.dhyper'),
		syntax:'dhyper(quantile, white balls, black balls, balls drawn)',
		description: 'Density for the hypergeometric distribution'
	},
	{
		key: 'phyper',
		title: tf('formula.phyper'),
		syntax:'phyper(quantile, white balls, black balls, balls drawn)',
		description: 'Distribution function for the hypergeometric distribution'
	},
	{
		key: 'qhyper',
		title: tf('formula.qhyper'),
		syntax:'qhyper(probability, white balls, black balls, balls drawn)',
		description: 'Quantile function for the hypergeometric distribution'
	},
	{
		key: 'rhyper',
		title: tf('formula.rhyper'),
		syntax:'rhyper(white balls, black balls, balls drawn)',
		description: 'Random generation for the hypergeometric distribution',
		addStart: '1,'
	},
	{
		key: 'dlogis',
		title: tf('formula.dlogis'),
		syntax:'dlogis(quantile, location, scale)',
		description: 'Density for the logistic distribution'
	},
	{
		key: 'plogis',
		title: tf('formula.plogis'),
		syntax:'plogis(quantile, location, scale)',
		description: 'Distribution function for the logistic distribution'
	},
	{
		key: 'qlogis',
		title: tf('formula.qlogis'),
		syntax:'qlogis(probability, location, scale)',
		description: 'Quantile function for the logistic distribution'
	},
	{
		key: 'rlogis',
		title: tf('formula.rlogis'),
		syntax:'rlogis(location, scale)',
		description: 'Random generation for the logistic distribution',
		addStart: '1,'
	},
	{
		key: 'dlnorm',
		title: tf('formula.dlnorm'),
		syntax:'dlnorm(quantile, mean log, standard deviation log)',
		description: 'Density for the log normal distribution'
	},
	{
		key: 'plnorm',
		title: tf('formula.plnorm'),
		syntax:'plnorm(quantile, mean log, standard deviation log)',
		description: 'Distribution function for the log normal distribution'
	},
	{
		key: 'qlnorm',
		title: tf('formula.qlnorm'),
		syntax:'qlnorm(probability, mean log, standard deviation log)',
		description: 'Quantile function for the log normal distribution'
	},
	{
		key: 'rlnorm',
		title: tf('formula.rlnorm'),
		syntax:'rlnorm(mean log, standard deviation log)',
		description: 'Random generation for the log normal distribution',
		addStart: '1,'
	},
	{
		key: 'dnbinom',
		title: tf('formula.dnbinom'),
		syntax:'dnbinom(quantile, number of trials, probability of success)',
		description: 'Density for the negative binomial distribution'
	},
	{
		key: 'pnbinom',
		title: tf('formula.pnbinom'),
		syntax:'pnbinom(quantile, number of trials, probability of success)',
		description: 'Distribution function for the negative binomial distribution'
	},
	{
		key: 'qnbinom',
		title: tf('formula.qnbinom'),
		syntax:'qnbinom(probability, number of trials, probability of success)',
		description: 'Quantile function for the negative binomial distribution'
	},
	{
		key: 'rnbinom',
		title: tf('formula.rnbinom'),
		syntax:'rnbinom(number of trials, probability of success)',
		description: 'Random generation for the negative binomial distribution',
		addStart: '1,'
	},
	{
		key: 'dunif',
		title: tf('formula.dunif'),
		syntax:'dunif(quantile, min, max)',
		description: 'Density for the uniform distribution'
	},
	{
		key: 'punif',
		title: tf('formula.punif'),
		syntax:'punif(quantile, min, max)',
		description: 'Distribution function for the uniform distribution'
	},
	{
		key: 'qunif',
		title: tf('formula.qunif'),
		syntax:'qunif(probability, min, max)',
		description: 'Quantile function for the uniform distribution'
	},
	{
		key: 'runif',
		title: tf('formula.runif'),
		syntax:'runif(min, max)',
		description: 'Random generation for the uniform distribution',
		addStart: '1,'
	},
	{
		key: 'dwilcox',
		title: tf('formula.dwilcox'),
		syntax:'dunif(quantile, number of observations 1, number of observations 2)',
		description: 'Density for the distribution of the Wilcoxon rank sum statistic'
	},
	{
		key: 'pwilcox',
		title: tf('formula.pwilcox'),
		syntax:'punif(quantile, number of observations 1, number of observations 2)',
		description: 'Distribution function for the distribution of the Wilcoxon rank sum statistic'
	},
	{
		key: 'qwilcox',
		title: tf('formula.qwilcox'),
		syntax:'qunif(probability, number of observations 1, number of observations 2)',
		description: 'Quantile function for the distribution of the Wilcoxon rank sum statistic'
	},
	{key: 'rwilcox',
		title: tf('formula.rwilcox'),
		syntax:'runif(number of observations 1, number of observations 2)',
		description: 'Random generation for the distribution of the Wilcoxon rank sum statistic',
		addStart: '1,'
	},
];

const formulas = rFormulas;

const formulam = {};
rFormulas.forEach((f) => {
  formulam[f.key] = f;
});

export default rFormulas

export {
	formulam,
	formulas,
  rFormulas,
}
