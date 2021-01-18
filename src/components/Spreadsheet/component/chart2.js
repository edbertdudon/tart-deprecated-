import { h } from './element';
import { bind, unbind } from './event';
import { cssPrefix } from '../config';
import chartpng from './chart.png';

// function startResize(e) {
//   const { overlayerEl, boundResizing, boundEndResize } = this;
//   e.preventDefault();
//   e.stopPropagation();
//   saveEventState.call(this, e);
//   bind(overlayerEl.el, 'mousemove', boundResizing)
//   bind(overlayerEl.el, 'mouseup', boundEndResize)
// };
//
// function endResize(e) {
//   const { overlayerEl, boundEndResize, boundResizing } = this;
//   e.preventDefault();
//     unbind(overlayerEl.el, 'mouseup', boundEndResize)
//     unbind(overlayerEl.el, 'touchend', boundEndResize)
//     unbind(overlayerEl.el, 'mousemove', boundResizing)
//     unbind(overlayerEl.el, 'touchmove', boundResizing)
// };
//
// function saveEventState(e) {
//   const { event_state, $container, verticalScrollbar, horizontalScrollbar } = this;
//   const { top } = verticalScrollbar.scroll();
//   const { left } = horizontalScrollbar.scroll();
//   // Save the initial event details and container state
//   event_state.container_width = $container.offset().width;
//   event_state.container_height = $container.offset().height;
//   event_state.container_left = $container.offset().left;
//   event_state.container_top = $container.offset().top;
//   event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + left;
//   event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + top;
//
//   // This is a fix for mobile safari
//   // For some reason it does not allow a direct copy of the touches property
//   if (typeof e.originalEvent.touches !== 'undefined') {
//   	event_state.touches = [];
//     console.log(e.originalEvent.touches)
//   	// $.each(e.originalEvent.touches, function(i, ob) {
//   	//   event_state.touches[i] = {};
//   	//   event_state.touches[i].clientX = 0+ob.clientX;
//   	//   event_state.touches[i].clientY = 0+ob.clientY;
//   	// });
//   }
//   event_state.evnt = e;
// }

// function resizing(e) {
//   const {
//     $container, constrain, orig_src, min_width, min_height,
//     max_width, max_height, event_state, verticalScrollbar,
//     horizontalScrollbar
//   } = this;
//   const { top } = verticalScrollbar.scroll();
//   const { left } = horizontalScrollbar.scroll();
//   var mouse={},
//     width,
//     height,
//     container_left,
//     container_top,
//     offset=$container.offset();
//   mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + left;
//   mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + top;
//   width = mouse.x - event_state.container_left;
//   height = mouse.y  - event_state.container_top;
//   container_left = event_state.container_left;
//   container_top = event_state.container_top;
//
//   if(constrain || e.shiftKey){
//       height = width / orig_src.width * orig_src.height;
//   }
//
//   if(width > min_width && height > min_height && width < max_width && height < max_height){
//     resizeImage.call(this, width, height);
//     // Without this Firefox will not re-calculate the the image dimensions until drag end
//     $container.offset({'left': container_left, 'top': container_top});
//   }
// }

// function resizeImage(width, height) {
//   const { resize_canvas, orig_src, image_target } = this;
//   resize_canvas.width = width;
//   resize_canvas.height = height;
//   resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
//   image_target.attr('src', resize_canvas.toDataURL("image/png"));
// };

export default class Chart {
  constructor($container, verticalScrollbar, horizontalScrollbar, overlayerEl) {
    this.orig_src = new Image();
    this.event_state = {};
    this.constrain = false;
    this.min_width = 60;
    this.min_height = 60;
    this.max_width = 800;
    this.max_height = 900;
    this.resize_canvas = document.createElement('canvas');
    this.overlayerEl = overlayerEl;
    this.verticalScrollbar = verticalScrollbar;
    this.horizontalScrollbar = horizontalScrollbar;
    this.boundResizing = this.resizing.bind(this);
    this.boundEndResize = this.endResize.bind(this);
    this.boundMoving = this.moving.bind(this);
    this.boundEndMoving = this.endMoving.bind(this);
    this.$container = $container.children(
      // this.nw = h('span', `${cssPrefix}-resize-handle resize-handle-nw`)
      //   .on('mousedown', (evt) => {
      //     this.startResize(evt);
      //   }),
      // this.ne = h('span', `${cssPrefix}-resize-handle resize-handle-ne`)
      //   .on('mousedown', (evt) => {
      //     this.startResize(evt);
      //   }),
      this.image_target = h('img', `${cssPrefix}-resize-image`)
        .attr('src', chartpng)
        .attr('width', '500px')
        .attr('height', '500px')
        // .attr('top', '35px')
        // .attr('left', '800px')
        .on('mousedown', (evt) => {
          this.startMoving(evt);
        }),
      // this.se = h('span', `${cssPrefix}-resize-handle resize-handle-se`)
      //   .on('mousedown', (evt) => {
      //     this.startResize(evt);
      //   }),
      // this.sw = h('span', `${cssPrefix}-resize-handle resize-handle-sw`)
      //   .on('mousedown', (evt) => {
      //     this.startResize(evt);
      //   }),
    );
  }

  startResize(e) {
    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);
    bind(this.overlayerEl.el, 'mousemove', this.boundResizing);
    bind(this.overlayerEl.el, 'mouseup', this.boundEndResize);
  }

  endResize(e) {
    e.preventDefault();
    unbind(this.overlayerEl.el, 'mouseup', this.boundEndResize);
    unbind(this.overlayerEl.el, 'touchend', this.boundEndResize);
    unbind(this.overlayerEl.el, 'mousemove', this.boundResizing);
    unbind(this.overlayerEl.el, 'touchmove', this.boundResizing);
  }

  saveEventState(e) {
    const {
      event_state, $container, horizontalScrollbar, verticalScrollbar,
    } = this;
    // Save the initial event details and container state
    event_state.container_width = $container.offset().width;
    event_state.container_height = $container.offset().height;
    event_state.container_left = $container.offset().left;
    event_state.container_top = $container.offset().top;
    event_state.mouse_x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + horizontalScrollbar.scroll().left;
    event_state.mouse_y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + verticalScrollbar.scroll().top;

    // This is a fix for mobile safari
    // For some reason it does not allow a direct copy of the touches property
    // if (typeof e.originalEvent.touches !== 'undefined') {
    // 	event_state.touches = [];
    //   e.originalEvent.touches.forEach((i, ob) => {
    //       event_state.touches[i] = {};
    //       event_state.touches[i].clientX = 0+ob.clientX;
    //       event_state.touches[i].clientY = 0+ob.clientY;
    //   });
    // }
    event_state.evnt = e;
  }

  resizing(e) {
    const {
      $container, constrain, orig_src, min_width, min_height,
      max_width, max_height, event_state, verticalScrollbar,
      horizontalScrollbar,
    } = this;
    const mouse = {};
    let width;
    let height;
    let cleft;
    let ctop;
    const offset = $container.offset();
    mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + horizontalScrollbar.scroll().left;
    mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + verticalScrollbar.scroll().top;

    // Position image differently depending on the corner dragged and constraints
    // if (event_state.evnt.target.classList.contains('resize-handle-se')) {
    width = mouse.x - event_state.container_left;
    height = mouse.y - event_state.container_top;
    cleft = event_state.container_left;
    ctop = event_state.container_top;
    console.log(width, height, cleft, ctop);
    // } else if (event_state.evnt.target.classList.contains('resize-handle-sw')) {
    //   width = event_state.container_width - (mouse.x - event_state.container_left);
    //   height = mouse.y  - event_state.container_top;
    //   cleft = mouse.x;
    //   ctop = event_state.container_top;
    // } else if (event_state.evnt.target.classList.contains('resize-handle-nw')) {
    //   width = event_state.container_width - (mouse.x - event_state.container_left);
    //   height = event_state.container_height - (mouse.y - event_state.container_top);
    //   cleft = mouse.x;
    //   ctop = mouse.y;
    //   if(constrain || e.shiftKey){
    //     ctop = mouse.y - ((width / orig_src.width * orig_src.height) - height);
    //   }
    // } else if (event_state.evnt.target.classList.contains('resize-handle-ne')) {
    //   width = mouse.x - event_state.container_left;
    //   height = event_state.container_height - (mouse.y - event_state.container_top);
    //   cleft = event_state.container_left;
    //   ctop = mouse.y;
    //   if(constrain || e.shiftKey){
    //     ctop = mouse.y - ((width / orig_src.width * orig_src.height) - height);
    //   }
    // }

    if (constrain || e.shiftKey) {
      height = width / orig_src.width * orig_src.height;
    }

    // if(width > min_width && height > min_height && width < max_width && height < max_height) {
    this.resizeImage(width, height);
    // Without this Firefox will not re-calculate the the image dimensions until drag end
    $container.offset({ left: cleft, top: ctop });
    // }
  }

  resizeImage(width, height) {
    const { resize_canvas, orig_src, image_target } = this;
    resize_canvas.width = width;
    resize_canvas.height = height;
    resize_canvas.getContext('2d').drawImage(orig_src, 0, 0, width, height);
    image_target.attr('src', resize_canvas.toDataURL('image/png'));
  }

  startMoving(e) {
    e.preventDefault();
    e.stopPropagation();
    this.saveEventState(e);
    // bind(this.overlayerEl.el, 'mousemove', this.boundMoving)
    // bind(this.overlayerEl.el, 'mouseup', this.boundEndMoving)
    this.overlayerEl.on('mousemove', this.boundMoving);
    this.overlayerEl.on('mouseup', this.boundEndMoving);
  }

  endMoving(e) {
    e.preventDefault();
    unbind(this.overlayerEl.el, 'mouseup', this.boundEndMoving);
    unbind(this.overlayerEl.el, 'mousemove', this.boundMoving);
    console.log('unbinded moving');
  }

  moving(e) {
    const {
      $container, event_state, horizontalScrollbar, verticalScrollbar,
    } = this;
    const mouse = {};
    e.preventDefault();
    e.stopPropagation();
    mouse.x = (e.clientX || e.pageX) + horizontalScrollbar.scroll().left;
    mouse.y = (e.clientY || e.pageY) + verticalScrollbar.scroll().top;
    $container.offset({
      left: mouse.x - (event_state.mouse_x - event_state.container_left),
      top: mouse.y - (event_state.mouse_y - event_state.container_top),
    });
  }
}
