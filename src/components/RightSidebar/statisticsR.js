const statistics = [
	// Optimization and model fitting
	// {name: "Optimization", function: "optimx(", arguments: ["optim"]},
	// {name: "Linear model fitting", function: "summary()", arguments: ["formula"]},
	// {name: "Generalized linear model fit", function: "glm()", options: ["binomial, gaussian, Gamma, inverse.gaussian, poisson, quasi, quasibinomial, quasipoisson"]},
	// {name: "Local polynomial regression fitting", function: "loess()"},
	// {name: "Nonlinear least-squares", function: "nls()"},

	// Frequency tables
	{name: "Frequency Tables"},
	{name: "Two-Way frequency table", function: "ftable(", arguments: ["xvariable", "yvariable"]},
	{name: "Three-Way frequency table", function: "ftable(", arguments: ["xvariable", "yvariable", "zvariable"]},
	// Two-Way Cross Tabulation

	// Tests of Independence
	{name: "Tests of Independence"},
	{name: "Chi-squared test", function: "chisq.test(", arguments: ["xvariable", "yvariable"], description: "Performs chi-squared contingency table tests and goodness-of-fit tests."},
	{name: "Fisher's exact test", function: "fisher.test(", arguments: ["xvariable", "yvariable", "alt", "conf"], description: "Table must be two-dimensional (2 x 2). Performs Fisher's exact test for testing the null of independence of rows and columns in a contingency table with fixed marginals."},
	// Requires 3 dimensional array {name: "Cochran-Mantel-Haenszal Chi-Squared test for count data", function: "mantelhaen.test(", arguments: ["xvariable", "yvariable", "zvariable", "alt", "conf"], },
	// loglinear models library: "MASS"

	// t-tests
	{name: "t-tests"},
	{name: "One sample t-test", function: "t.test(", arguments: ["xvariable", "alt", "varEqual", "mu", "conf"]},
	{name: "Paired t-test", function: "t.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"]},
	{name: "Independent Two-group t-test", function: "t.test(", arguments: ["xvariable", "yvariable", "alt", "varEqual", "conf"]},
	// {name: "F test to compare two variances", function: "var.test("},

	// Correlations
	// {header: "Correlations"}
	{name: "Covariance", function: "cov(", arguments: ["matrix" ,"corr"]},
	{name: "Correlation", function: "cor(", arguments: ["matrix", "corr"]},

	// Nonparametric Tests of Group Differences
	{name: "Nonparametric Tests of Group Differences"},
	{name: "Independent Two-group Mann-Whitney U Test", function: "wilcox.test(", arguments: ["xvariable", "yvariable", "alt"] },
	{name: "Dependent Two-group Wilcoxon Signed Rank Test", function: "wilcox.test(paired=TRUE,", arguments: ["xvariable", "yvariable", "alt"] },
	{name: "Kruskal-Wallis rank sum test", function: "kruskal.test(", arguments: ["xvariable", "groups"]},
	{name: "Friedman rank sum test", function: "friedman.test(", arguments: ["yvariable", "groups", "blocks"]},

	// Multiple (Linear) Regression
	{name: "Multiple (Linear) Regression"},
	{name: "Coefficients", function: "coefficients(", arguments: ["multipleLinearRegression"]},
	{name: "Confidence Intervals", function: "confint(", arguments: ["multipleLinearRegression", "level"]},
	{name: "Fitted Values", function: "fitted(", arguments: ["multipleLinearRegression"]},
	{name: "Residuals", function: "residuals(", arguments: ["multipleLinearRegression"]},
	{name: "ANOVA (general)", function: "anova(", arguments: ["multipleLinearRegression"], description: "Compute analysis of variance (or deviance) tables for one or more fitted model objects."},
	{name: "Variance-covariance matrix", function: "vcov(", arguments: ["multipleLinearRegression"]},
	{name: "Linear model fitting", function: "influence(", arguments: ["multipleLinearRegression"]},
	{name: "Compare models (ANOVA)", function: "anova(", arguments: ["multipleLinearRegression", "multipleLinearRegression2"], description: "Tests the models against one another in the order specified."},
	// Cross Validation
	// Variable Selection
	// Relative Importance
	// Nonlinear regression
	// Robust regression

	// ANOVA
	{name: "ANOVA"},
	{name: "One-Way ANOVA", function: "aov(", arguments: ["oneWayAnova"]},
	{name: "Randomized block design ANOVA", function: "aov(", arguments: ["randomizedBlockDesign"]},
	{name: "Two-Way ANOVA", function: "aov(", arguments: ["twoWayAnova"]},
	{name: "Analysis of covariance (ANCOVA)", function: "aov(", arguments: ["analysisOfCovariance"]},
	{name: "One-Way within subjects ANOVA", function: "aov(", arguments: ["oneWayWithin"]},
	{name: "Two-Way within subjects ANOVA", function: "aov(", arguments: ["twoWayWithin"]},
	{name: "Two-Way between factors ANOVA", function: "aov(", arguments: ["twoWayBetween"]},
	// TukeyHSD

	// MANOVA
	{name: "MANOVA"},
	{name: "One-Way MANOVA", function: "manova(", arguments: ["oneWayManova"]},
	{name: "Randomized block design MANOVA", function: "manova(", arguments: ["randomizedBlockDesignManova"]},
	{name: "Two-Way ANOVA", function: "manova(", arguments: ["twoWayManova"]},
	{name: "Analysis of covariance (MANCOVA)", function: "manova(", arguments: ["mancova"]},
	{name: "One-Way within subjects MANOVA", function: "manova(", arguments: ["oneWayWithinManova"]},
	{name: "Two-Way within subjects MANOVA", function: "manova(", arguments: ["twoWayWithinManova"]},
	{name: "Two-Way between factors MANOVA", function: "manova(", arguments: ["twoWayBetweenManova"]},

	// Tests
	{name: "Ansari-Bradley test", function: "ansari.test())"},
	{name: "Bartlett test of homogeneity of variances", function: "bartlett.test()"},
	// {name: "Exact binom test", function: "binom.test()"},
	// {name: "Box-pierce and Ljung-Box test", function: "Box.test()"},
	{name: "Test for association/correlation between paired samples", function: "cor.test()"},
	{name: "Filgner-Killeen test for homegenity of variances", function: "filgner.test()"},


	// {name: "Kolmogorov-Smirnov test", function: "ks.test()"},
	// {name: "Mauchly's test of sphericity", function: "mauchly.test()"},
	// {name: "Mcnemar's Chi-Squared test for count data", function: "mcnemar.test()"},
	{name: "Mood two-sample test of scale", function: "mood.test()"},
	{name: "Equal means in a one-way layout", function: "oneway.test()"},
	// {name: "Pairwise comparisons for proportions", function: "bartlett.test()"},
	{name: "Pairwise t-tests", function: "pairwise.t.test()"},
	// {name: "Pairwise Wilcoxon rank sum tests", function: "pairwise.wilcox.test()"},
	// {name: "Exact poisson test", function: "poisson.test()"},
	// {name: "Power calculations for balanced one-way analysis of variance tests", function: "power.anova.test()"},
	// {name: "Power calculations for one and two sample t-tests", function: "power.t.test()"},
	// {name: "Phillips-Perron test for unit roots", function: "PP.test()"},
	// {name: "Print method for hypothesis tests and power calculation object", function: "print.htest()"},
	// {name: "Test for equal or given proportions", function: "prop.test()"},
	{name: "Quade test", function: "quade.test()"},
	// {name: "Shapiro-Wilk normality test", function: "shapiro.test()"},

]

export default statistics
