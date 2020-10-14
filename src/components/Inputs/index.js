// //
// //  Inputs.js
// //  Tart
// //
// //  Created by Edbert Dudon on 7/8/19.
// //  Copyright © 2019 Project Tart. All rights reserved.
// //
//
// import React from 'react'
// import { compose } from 'recompose'
// import Home from '../Home/header'
// import Content from './content'
//
// import { withAuthorization, withEmailVerification } from '../Session'
//
// const Inputs = () => (
//   <div className='home-screen'>
//     <Header />
//     <Content />
//   </div>
// )
//
// const condition = authUser => !!authUser
//
// export default compose(
//   withEmailVerification,
//   withAuthorization(condition),
// )(Inputs)
