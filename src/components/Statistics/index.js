//
//  Statistics
//  Tart
//
//  Created by Edbert Dudon on 7/8/19.
//  Copyright © 2019 Project Tart. All rights reserved.
//
import React, { useState, useEffect } from 'react'
import StatisticDescription from './component/statisticdescription'
import OneWayTable from './component/onewaytable'
import ChiSquareTest from './component/chisqtest'
import FisherExactTest from './component/fishertest'
import CochranMantelHaenTest from './component/mantelhaentest'
import Correlation from './component/correlation'
import CorrelationSignificance from './component/cortest'
import OneSampleTTest from './component/onettest'
import TwoSampleTTest from './component/twottest'
import WilcoxTest from './component/wilcoxtest'
import KruskalTest from './component/kruskaltest'
import FriedmanTest from './component/friedmantest'
import LinearRegression from './component/linreg'
import ConfidenceInterval from './component/confidenceinterval'
import AkaikeInformationCriterion from './component/aic'
import SimpleLinearRegression from './component/simplelinreg'
// import LogisticRegression from './component/binomreg'
// import GammaRegression from './component/gammareg'
// import InverseGammaRegression from './component/inversegammareg'
// import PoissonRegression from './component/poissonreg'
// import QuasiRegression from './component/quasireg'
// import QuasiBinomRegression from './component/quasibinomreg'
// import QuasiPoissonRegression from './component/quasipoissonreg'
import DurbinWatsonTest from './component/durbinwatson'
import OutlierTest from './component/outliertest'
import Ancova1Covariate from './component/ancovawith1cov'
import TwoWayAov from './component/twowayaov'
import TwoWayAncova2Covariate from './component/twowayancovawith2cov'
import RandomAnova from './component/randomaov'
import OneWayWithinAnova from './component/onewaywithinaov'
import RepeatedMeasuresAnova from './component/repeatedmeasuresaov'
// import CompareAnova from './component/companova'
// import TwoWayWithinAov from './component/twowaywithinaov'
// import TwoWayBetweenAov from './component/twowaybetweenaov'
import OneWayManova from './component/onewayman'
import RobustOneWayManova from './component/robustonewayman'
// import RandomManova from './component/randommanova'
// import TwoWayManova from './component/twowaymanova'
// import Mancova from './component/covmanova'
// import OneWayWithinManova from './component/onewaywithinmanova'
// import TwoWayWithinManova from './component/twowaywithinmanova'
// import TwoWayBetweenManova from './component/twowaybetweenmanova'
// import BinomTest from './component/binomtest'
// import AnsariBradleyTest from './component/ansaritest'
// import KolmogorovTest from './component/kstest'
// import MauchlyTest from './component/mauchlytest'
// import McnemarTest from './component/mcnemartest'
// import MoodTest from './component/moodtest'
// import OneWayTest from './component/onewaytest'
// import ExactPoissonTest from './component/poissontest'
// import PowerAnovaTest from './component/poweranovatest'
// import PowerTTest from './component/powerttest'
// import PhillipsPerronTest from './component/PPtest'
// import PrintHypothesisTest from './component/printhtest'
// import QuadeTest from './component/quadetest'
// import ShapiroTest from './component/shapirotest'

const Statistics = ({ statistic }) => (
  <div>
    {
      {
        statdesc: <StatisticDescription statistic={statistic} />,
        onewaytable: <OneWayTable statistic={statistic} />,
        // twowaytable: <TwoWayTable statistic={statistic} />,
        // threewaytable: <ThreeWayTable statistic={statistic} />,
        chisqtest: <ChiSquareTest statistic={statistic} />,
        fishertest: <FisherExactTest statistic={statistic} />,
        mantelhaentest: <CochranMantelHaenTest statistic={statistic} />,
        cor: <Correlation statistic={statistic} />,
        cov: <Correlation statistic={statistic} />,
        cortest: <CorrelationSignificance statistic={statistic} />,
  	    onettest: <OneSampleTTest statistic={statistic} />,
        pairedttest: <TwoSampleTTest statistic={statistic} />,
        independentttest: <TwoSampleTTest statistic={statistic} />,
      // 	pairwisettest: <PairwiseTTest statistic={statistic} />,
      // 	proptest: <ProportionsTest statistic={statistic} />,
        wilcoxtest: <WilcoxTest statistic={statistic} />,
        pairedwilcoxtest: <WilcoxTest statistic={statistic} />,
      //   pairwisewilcoxtext: <PairwiseWilcoxtest statistic={statistic} />,
        kruskaltest: <KruskalTest statistic={statistic} />,
        friedmantest: <FriedmanTest statistic={statistic} />,
        coef: <LinearRegression statistic={statistic} />,
        confint: <ConfidenceInterval statistic={statistic} />,
        fitted: <LinearRegression statistic={statistic} />,
        residuals: <LinearRegression statistic={statistic} />,
        vcov: <LinearRegression statistic={statistic} />,
        aic: <AkaikeInformationCriterion statistic={statistic} />,
        predict: <LinearRegression statistic={statistic} />,
        simplelinreg: <SimpleLinearRegression statistic={statistic} />,
        linreg: <LinearRegression statistic={statistic} />,
      //   binomreg: <LogisticRegression statistic={statistic} />,
      // // 	gaussianreg: <GaussianRegression statistic={statistic} />,
      // 	gammareg: <GammaRegression statistic={statistic} />,
      //   inversegammareg: <InverseGammaRegression statistic={statistic} />,
      //   poissonreg: <PoissonRegression statistic={statistic} />,
      //   quasireg: <QuasiRegression statistic={statistic} />,
      //   quasibinomreg: <QuasiBinomRegression statistic={statistic} />,
      //   quasipoissonreg: <QuasiPoissonRegression statistic={statistic} />,
        durbinwatson: <DurbinWatsonTest statistic={statistic} />,
        ncvtest: <LinearRegression statistic={statistic} />,
        outliertest: <OutlierTest statistic={statistic} />,
        varianceinflation: <LinearRegression statistic={statistic} />,
      //   influence: <LinearModelFit statistic={statistic} />,
      //   companova: <CompareAnova statistic={statistic} />,
        anova: <LinearRegression statistic={statistic} />,
        onewayaov: <SimpleLinearRegression statistic={statistic} />,
        tukeyhsd: <ConfidenceInterval statistic={statistic} />,
        ancovawith1cov: <Ancova1Covariate statistic={statistic} />,
        twowayaov: <TwoWayAov statistic={statistic} />,
        twowayancovawith2cov: <TwoWayAncova2Covariate statistic={statistic} />,
        randomaov: <RandomAnova statistic={statistic} />,
        onewaywithinaov: <OneWayWithinAnova statistic={statistic} />,
        repeatedmeasuresaov: <RepeatedMeasuresAnova statistic={statistic} />,
      //   twowaywithinaov: <TwoWayWithinAov statistic={statistic} />,
      //   twowaybetweenaov: <TwoWayBetweenAov statistic={statistic} />,
        manova: <LinearRegression statistic={statistic} />,
        onewayman: <OneWayManova statistic={statistic} />,
        robustonewayman: <RobustOneWayManova statistic={statistic} />,
      //   randommanova: <RandomManova statistic={statistic} />,
      //   twowaymanova: <TwoWayManova statistic={statistic} />,
      //   covmanova: <Mancova statistic={statistic} />,
      //   onewaywithinmanova: <OneWayWithinManova statistic={statistic} />,
      //   twowaywithinmanova: <TwoWayWithinManova statistic={statistic} />,
      //   twowaybetweenmanova: <TwoWayBetweenManova statistic={statistic} />,
        bartletttest: <SimpleLinearRegression statistic={statistic} />,
        filgnertest: <SimpleLinearRegression statistic={statistic} />,
        // hovtest: <SimpleLinearRegression statistic={statistic} />,
      //   binomtest: <BinomTest statistic={statistic} />,
      //   ansaritest: <AnsariBradleyTest statistic={statistic} />,
      // // 	Boxtest: <BoxTest statistic={statistic} />,
      // // 	kstest: <KolmogorovTest statistic={statistic} />,
      // // 	mauchlytest: <MauchlyTest statistic={statistic} />,
      // // 	mcnemartest: <McnemarTest statistic={statistic} />,
      // 	moodtest: <MoodTest statistic={statistic} />,
      //   onewaytest: <OneWayTest statistic={statistic} />,
      // // 	bartletttest: "Pairwise comparisons for proportions",
      // // 	poissontest: <ExactPoissonTest statistic={statistic} />,
      // // 	poweranovatest: <PowerAnovaTest statistic={statistic} />,
      // // 	powerttest: <PowerTTest statistic={statistic} />,
      // // 	PPtest: <PhillipsPerronTest statistic={statistic} />,
      // // 	printhtest: <PrintHypothesisTest statistic={statistic} />,
      // 	quadetest: <QuadeTest statistic={statistic} />,
      // // 	shapirotest: <ShapiroTest statistic={statistic} />,
      }[statistic]
    }
  </div>
)

export default Statistics
