const statistics = [
	// Optimization and model fitting
	// {name: "Optimization", function: "optimx(", arguments: ["optim"], category: 0},
	// {name: "Linear model fitting", function: "summary()", arguments: ["formula"], category: 0},
	// {name: "Generalized linear model fit", function: "glm()", options: ["binomial, gaussian, Gamma, inverse.gaussian, poisson, quasi, quasibinomial, quasipoisson"], category: 0},
	// {name: "Local polynomial regression fitting", function: "loess()", category: 0},
	// {name: "Nonlinear least-squares", function: "nls()", category: 0},

	// Frequency tables
	{name: "Frequency Tables", category: 0},
	{name: "Two-Way frequency table", function: "ftable(", arguments: ["xvariable", "yvariable"], category: 0},
	{name: "Three-Way frequency table", function: "ftable(", arguments: ["xvariable", "yvariable", "zvariable"], category: 0},
	// Two-Way Cross Tabulation

	// Tests of Independence
	{name: "Tests of Independence", category: 1},
	{
		name: "Chi-squared test",
		function: "chisq.test(",
		arguments: ["xvariable", "yvariable"],
		description: "Performs chi-squared contingency table tests and goodness-of-fit tests.",
		category: 1
	},
	{
		name: "Fisher's exact test",
		function: "fisher.test(",
		arguments: ["xvariable", "yvariable", "alt", "conf"],
		description: "Table must be two-dimensional (2 x 2). Performs Fisher's exact test for testing the null of independence of rows and columns in a contingency table with fixed marginals.",
		category: 1
	},
	// Requires 3 dimensional array {name: "Cochran-Mantel-Haenszal Chi-Squared test for count data", function: "mantelhaen.test(", arguments: ["xvariable", "yvariable", "zvariable", "alt", "conf"], , category: 0},
	// loglinear models library: "MASS"

	// t-tests
	{name: "t-tests", category: 2},
	{name: "One sample t-test", function: "t.test(", arguments: ["xvariable", "alt", "varEqual", "mu", "conf"], category: 2},
	{name: "Paired t-test", function: "t.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"], category: 2},
	{name: "Independent Two-group t-test", function: "t.test(", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"], category: 2},
	// {name: "F test to compare two variances", function: "var.test(", category: 2},

	// Correlations
	// {header: "Correlations"}
	{name: "Covariance", function: "cov(", arguments: ["matrix" ,"corr"], category: 3},
	{name: "Correlation", function: "cor(", arguments: ["matrix", "corr"], category: 3},

	// Nonparametric Tests of Group Differences
	{name: "Nonparametric Tests of Group Differences", category: 4},
	{name: "Independent Two-group Mann-Whitney U Test", function: "wilcox.test(", arguments: ["xvariable", "yvariable", "alt"] , category: 4},
	{name: "Dependent Two-group Wilcoxon Signed Rank Test", function: "wilcox.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt"] , category: 4},
	{name: "Kruskal-Wallis rank sum test", function: "kruskal.test(", arguments: ["xvariable", "groups"], category: 4},
	{name: "Friedman rank sum test", function: "friedman.test(", arguments: ["yvariable", "groups", "blocks"], category: 4},

	// Multiple (Linear) Regression
	{name: "Multiple (Linear) Regression", category: 5},
	{name: "Coefficients", function: "coefficients(", arguments: ["multipleLinearRegression"], category: 5},
	{name: "Confidence Intervals", function: "confint(", arguments: ["multipleLinearRegression", "level"], category: 5},
	{name: "Fitted Values", function: "fitted(", arguments: ["multipleLinearRegression"], category: 5},
	{name: "Residuals", function: "residuals(", arguments: ["multipleLinearRegression"], category: 5},
	{name: "ANOVA (general)", function: "anova(", arguments: ["multipleLinearRegression"], description: "Compute analysis of variance (or deviance) tables for one or more fitted model objects.", category: 5},
	{name: "Variance-covariance matrix", function: "vcov(", arguments: ["multipleLinearRegression"], category: 5},
	{name: "Linear model fitting", function: "influence(", arguments: ["multipleLinearRegression"], category: 5},
	{name: "Compare models (ANOVA)", function: "anova(", arguments: ["multipleLinearRegression", "multipleLinearRegression2"], description: "Tests the models against one another in the order specified.", category: 5},
	// Cross Validation
	// Variable Selection
	// Relative Importance
	// Nonlinear regression
	// Robust regression

	// ANOVA
	{name: "ANOVA", category: 6},
	{name: "One-Way ANOVA", function: "aov(", arguments: ["oneWayAnova"], category: 6},
	{name: "Randomized block design ANOVA", function: "aov(", arguments: ["randomizedBlockDesign"], category: 6},
	{name: "Two-Way ANOVA", function: "aov(", arguments: ["twoWayAnova"], category: 6},
	{name: "Analysis of covariance (ANCOVA)", function: "aov(", arguments: ["analysisOfCovariance"], category: 6},
	{name: "One-Way within subjects ANOVA", function: "aov(", arguments: ["oneWayWithin"], category: 6},
	{name: "Two-Way within subjects ANOVA", function: "aov(", arguments: ["twoWayWithin"], category: 6},
	{name: "Two-Way between factors ANOVA", function: "aov(", arguments: ["twoWayBetween"], category: 6},
	// TukeyHSD

	// MANOVA
	{name: "MANOVA", category: 7},
	{name: "One-Way MANOVA", function: "manova(", arguments: ["oneWayManova"], category: 7},
	{name: "Randomized block design MANOVA", function: "manova(", arguments: ["randomizedBlockDesignManova"], category: 7},
	{name: "Two-Way ANOVA", function: "manova(", arguments: ["twoWayManova"], category: 7},
	{name: "Analysis of covariance (MANCOVA)", function: "manova(", arguments: ["mancova"], category: 7},
	{name: "One-Way within subjects MANOVA", function: "manova(", arguments: ["oneWayWithinManova"], category: 7},
	{name: "Two-Way within subjects MANOVA", function: "manova(", arguments: ["twoWayWithinManova"], category: 7},
	{name: "Two-Way between factors MANOVA", function: "manova(", arguments: ["twoWayBetweenManova"], category: 7},

	// Tests
	{name: "Ansari-Bradley test", function: "ansari.test())", category: 8},
	{name: "Bartlett test of homogeneity of variances", function: "bartlett.test()", category: 8},
	// {name: "Exact binom test", function: "binom.test()", category: 0},
	// {name: "Box-pierce and Ljung-Box test", function: "Box.test()", category: 0},
	{name: "Test for association/correlation between paired samples", function: "cor.test()", category: 8},
	{name: "Filgner-Killeen test for homegenity of variances", function: "filgner.test()", category: 8},


	// {name: "Kolmogorov-Smirnov test", function: "ks.test()", category: 0},
	// {name: "Mauchly's test of sphericity", function: "mauchly.test()", category: 0},
	// {name: "Mcnemar's Chi-Squared test for count data", function: "mcnemar.test()", category: 0},
	{name: "Mood two-sample test of scale", function: "mood.test()", category: 8},
	{name: "Equal means in a one-way layout", function: "oneway.test()", category: 8},
	// {name: "Pairwise comparisons for proportions", function: "bartlett.test()", category: 0},
	{name: "Pairwise t-tests", function: "pairwise.t.test()", category: 8},
	// {name: "Pairwise Wilcoxon rank sum tests", function: "pairwise.wilcox.test()", category: 0},
	// {name: "Exact poisson test", function: "poisson.test()", category: 0},
	// {name: "Power calculations for balanced one-way analysis of variance tests", function: "power.anova.test()", category: 0},
	// {name: "Power calculations for one and two sample t-tests", function: "power.t.test()", category: 0},
	// {name: "Phillips-Perron test for unit roots", function: "PP.test()", category: 0},
	// {name: "Print method for hypothesis tests and power calculation object", function: "print.htest()", category: 0},
	// {name: "Test for equal or given proportions", function: "prop.test()", category: 0},
	{name: "Quade test", function: "quade.test()", category: 8},
	// {name: "Shapiro-Wilk normality test", function: "shapiro.test()", category: 0},

]

export default statistics
