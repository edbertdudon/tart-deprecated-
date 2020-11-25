const statistics = [
	// Frequency tables
	// {
	// 	key: "Frequency Tables",
	// 	category: 0
	// },
	{
		key: "Two-Way frequency table",
		function: "ftable(",
		arguments: ["xvariable", "yvariable"],
		category: 0
	},
	{
		key: "Three-Way frequency table",
		function: "ftable(",
		arguments: ["xvariable", "yvariable", "zvariable"],
		category: 0
	},
	// Two-Way Cross Tabulation

	// Tests of Independence
	// {
	// 	key: "Tests of Independence",
	// 	category: 1
	// },
	{
		key: "Chi-squared test",
		function: "chisq.test(",
		arguments: ["xvariable", "yvariable"],
		description: "Performs chi-squared contingency table tests and goodness-of-fit tests.",
		category: 1
	},
	{
		key: "Fisher's exact test",
		function: "fisher.test(",
		arguments: ["xvariable", "yvariable", "alt", "conf"],
		description: "Table must be two-dimensional (2 x 2). Performs Fisher's exact test for testing the null of independence of rows and columns in a contingency table with fixed marginals.",
		category: 1
	},
	// Requires 3 dimensional array {key: "Cochran-Mantel-Haenszal Chi-Squared test for count data", function: "mantelhaen.test(", arguments: ["xvariable", "yvariable", "zvariable", "alt", "conf"], , category: 0},
	// loglinear models library: "MASS"

	// t-tests
	// {key: "t-tests", category: 2},
	{key: "One sample t-test", function: "t.test(", arguments: ["xvariable", "alt", "varEqual", "mu", "conf"], category: 2},
	{key: "Paired t-test", function: "t.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"], category: 2},
	{key: "Independent Two-group t-test", function: "t.test(", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"], category: 2},
	// {key: "F test to compare two variances", function: "var.test(", category: 2},

	// Correlations
	// {header: "Correlations"}
	{key: "Covariance", function: "cov(", arguments: ["matrix" ,"corr"], category: 3},
	{key: "Correlation", function: "cor(", arguments: ["matrix", "corr"], category: 3},

	// Nonparametric Tests of Group Differences
	// {key: "Nonparametric Tests of Group Differences", category: 4},
	{key: "Independent Two-group Mann-Whitney U Test", function: "wilcox.test(", arguments: ["xvariable", "yvariable", "alt"] , category: 4},
	{key: "Dependent Two-group Wilcoxon Signed Rank Test", function: "wilcox.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt"] , category: 4},
	{key: "Kruskal-Wallis rank sum test", function: "kruskal.test(", arguments: ["xvariable", "groups"], category: 4},
	{key: "Friedman rank sum test", function: "friedman.test(", arguments: ["yvariable", "groups", "blocks"], category: 4},

	// Multiple (Linear) Regression
	// {key: "Multiple (Linear) Regression", category: 5},
	{key: "Coefficients", function: "coefficients(", arguments: ["multipleLinearRegression"], category: 5},
	{key: "Confidence Intervals", function: "confint(", arguments: ["multipleLinearRegression", "conf"], category: 5},
	{key: "Fitted Values", function: "fitted(", arguments: ["multipleLinearRegression"], category: 5},
	{key: "Residuals", function: "residuals(", arguments: ["multipleLinearRegression"], category: 5},
	{key: "ANOVA (general)", function: "anova(", arguments: ["multipleLinearRegression"], description: "Compute analysis of variance (or deviance) tables for one or more fitted model objects.", category: 5},
	{key: "Variance-covariance matrix", function: "vcov(", arguments: ["multipleLinearRegression"], category: 5},
	{key: "Linear model fitting", function: "influence(", arguments: ["multipleLinearRegression"], category: 5},
	{key: "Compare models (ANOVA)", function: "anova(", arguments: ["multipleLinearRegression", "multipleLinearRegression2"], description: "Tests the models against one another in the order specified.", category: 5},
	// Cross Validation
	// Variable Selection
	// Relative Importance
	// Nonlinear regression
	// Robust regression

	// ANOVA
	// {key: "ANOVA", category: 6},
	{key: "One-Way ANOVA", function: "aov(", arguments: ["oneWayAnova"], category: 6},
	{key: "Randomized block design ANOVA", function: "aov(", arguments: ["randomizedBlockDesign"], category: 6},
	{key: "Two-Way ANOVA", function: "aov(", arguments: ["twoWayAnova"], category: 6},
	{key: "Analysis of covariance (ANCOVA)", function: "aov(", arguments: ["analysisOfCovariance"], category: 6},
	{key: "One-Way within subjects ANOVA", function: "aov(", arguments: ["oneWayWithin"], category: 6},
	{key: "Two-Way within subjects ANOVA", function: "aov(", arguments: ["twoWayWithin"], category: 6},
	{key: "Two-Way between factors ANOVA", function: "aov(", arguments: ["twoWayBetween"], category: 6},
	// TukeyHSD

	// MANOVA
	// {key: "MANOVA", category: 7},
	{key: "One-Way MANOVA", function: "manova(", arguments: ["oneWayManova"], category: 7},
	{key: "Randomized block design MANOVA", function: "manova(", arguments: ["randomizedBlockDesignManova"], category: 7},
	{key: "Two-Way ANOVA", function: "manova(", arguments: ["twoWayManova"], category: 7},
	{key: "Analysis of covariance (MANCOVA)", function: "manova(", arguments: ["mancova"], category: 7},
	{key: "One-Way within subjects MANOVA", function: "manova(", arguments: ["oneWayWithinManova"], category: 7},
	{key: "Two-Way within subjects MANOVA", function: "manova(", arguments: ["twoWayWithinManova"], category: 7},
	{key: "Two-Way between factors MANOVA", function: "manova(", arguments: ["twoWayBetweenManova"], category: 7},

	// Tests
	{key: "Ansari-Bradley test", function: "ansari.test())", category: 8},
	{key: "Bartlett test of homogeneity of variances", function: "bartlett.test()", category: 8},
	{key: "Exact binom test", function: "binom.test(", arguments: ["successes", "trials", "prob", "alt", "conf"], category: 8},
	// {key: "Box-pierce and Ljung-Box test", function: "Box.test()", category: 8},
	{key: "Test for association/correlation between paired samples", function: "cor.test()", category: 8},
	{key: "Filgner-Killeen test for homegenity of variances", function: "filgner.test()", category: 8},


	// {key: "Kolmogorov-Smirnov test", function: "ks.test()", category: 8},
	// {key: "Mauchly's test of sphericity", function: "mauchly.test()", category: 8},
	// {key: "Mcnemar's Chi-Squared test for count data", function: "mcnemar.test()", category: 8},
	{key: "Mood two-sample test of scale", function: "mood.test()", category: 8},
	{key: "Equal means in a one-way layout", function: "oneway.test()", category: 8},
	// {key: "Pairwise comparisons for proportions", function: "bartlett.test()", category: 8},
	{key: "Pairwise t-tests", function: "pairwise.t.test()", category: 8},
	// {key: "Pairwise Wilcoxon rank sum tests", function: "pairwise.wilcox.test()", category: 8},
	// {key: "Exact poisson test", function: "poisson.test()", category: 8},
	// {key: "Power calculations for balanced one-way analysis of variance tests", function: "power.anova.test()", category: 8},
	// {key: "Power calculations for one and two sample t-tests", function: "power.t.test()", category: 8},
	// {key: "Phillips-Perron test for unit roots", function: "PP.test()", category: 8},
	// {key: "Print method for hypothesis tests and power calculation object", function: "print.htest()", category: 8},
	// {key: "Test for equal or given proportions", function: "prop.test()", category: 8},
	{key: "Quade test", function: "quade.test()", category: 8},
	// {key: "Shapiro-Wilk normality test", function: "shapiro.test()", category: 8},

]

export default statistics
