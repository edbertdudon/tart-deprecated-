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
import Covariance from './component/covariance'
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
// import CompareAnova from './component/companova'
// import OnewWayAov from './component/onewayaov'
// import RandomAov from './component/randomaov'
// import TwoWayAov from './component/twowayaov'
// import Ancova from './component/covaov'
// import OneWayWithinAov from './component/onewaywithinaov'
// import TwoWayWithinAov from './component/twowaywithinaov'
// import TwoWayBetweenAov from './component/twowaybetweenaov'
// import OneWayManova from './component/onewaymanova'
// import RandomManova from './component/randommanova'
// import TwoWayManova from './component/twowaymanova'
// import Mancova from './component/covmanova'
// import OneWayWithinManova from './component/onewaywithinmanova'
// import TwoWayWithinManova from './component/twowaywithinmanova'
// import TwoWayBetweenManova from './component/twowaybetweenmanova'
// import BinomTest from './component/binomtest'
// import AnsariBradleyTest from './component/ansaritest'
// import BartlettTest from './component/bartletttest'
// import FilgnerTest from './component/filgnertest'
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
        cov: <Covariance statistic={statistic} />,
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
        anova: <LinearRegression statistic={statistic} />,
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
      //   influence: <LinearModelFit statistic={statistic} />,
      //   companova: <CompareAnova statistic={statistic} />,
      //   onewayaov: <OnewWayAov statistic={statistic} />,
      //   randomaov: <RandomAov statistic={statistic} />,
      //   twowayaov: <TwoWayAov statistic={statistic} />,
      //   covaov: <Ancova statistic={statistic} />,
      //   onewaywithinaov: <OneWayWithinAov statistic={statistic} />,
      //   twowaywithinaov: <TwoWayWithinAov statistic={statistic} />,
      //   twowaybetweenaov: <TwoWayBetweenAov statistic={statistic} />,
      //   onewaymanova: <OneWayManova statistic={statistic} />,
      //   randommanova: <RandomManova statistic={statistic} />,
      //   twowaymanova: <TwoWayManova statistic={statistic} />,
      //   covmanova: <Mancova statistic={statistic} />,
      //   onewaywithinmanova: <OneWayWithinManova statistic={statistic} />,
      //   twowaywithinmanova: <TwoWayWithinManova statistic={statistic} />,
      //   twowaybetweenmanova: <TwoWayBetweenManova statistic={statistic} />,
      //   binomtest: <BinomTest statistic={statistic} />,
      //   ansaritest: <AnsariBradleyTest statistic={statistic} />,
      //   bartletttest: <BartlettTest statistic={statistic} />,
      // // 	Boxtest: <BoxTest statistic={statistic} />,
      //   filgnertest: <FilgnerTest statistic={statistic} />,
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
