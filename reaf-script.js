(function() {

  var $$ = function(selector, context) {
    var context = context || document;
    var elements = context.querySelectorAll(selector);
    return [].slice.call(elements);
  };

  function _fncSliderInit($slider, options) {
    var prefix = ".fnc-";
    var $slidesCont = $slider.querySelector(prefix + "slider__slides");
    if (!$slidesCont) {
      console.error("Error: .fnc-slider__slides not found in slider", $slider);
      return;
    }
    var $slides = $$(prefix + "slide", $slider);
    var $controls = $$(prefix + "nav__control", $slider);
    var $controlsBgs = $$(prefix + "nav__bg", $slider);
    var $progressAS = $$(prefix + "nav__control-progress", $slider);

    var numOfSlides = $slides.length;
    var curSlide = 1;
    var sliding = false;

    var transitionDuration = getComputedStyle($slidesCont)["transition-duration"];
    var transitionDelay = getComputedStyle($slidesCont)["transition-delay"];
    var slidingAT = transitionDuration ? +parseFloat(transitionDuration) * 1000 : 300;
    var slidingDelay = transitionDelay ? +parseFloat(transitionDelay) * 1000 : 0;

    var autoSlidingActive = false;
    var autoSlidingTO;
    var autoSlidingDelay = 5000;
    var autoSlidingBlocked = false;

    var $activeSlide;
    var $activeControlsBg;
    var $prevControl;

    function setIDs() {
      $slides.forEach(function($slide, index) {
        $slide.classList.add("fnc-slide-" + (index + 1));
      });
      $controls.forEach(function($control, index) {
        $control.setAttribute("data-slide", index + 1);
        $control.classList.add("fnc-nav__control-" + (index + 1));
      });
      $controlsBgs.forEach(function($bg, index) {
        $bg.classList.add("fnc-nav__bg-" + (index + 1));
      });
    }
    setIDs();

    function afterSlidingHandler() {
      var prevSlide = $slider.querySelector(".m--previous-slide");
      var prevBg = $slider.querySelector(".m--previous-nav-bg");
      if (prevSlide) prevSlide.classList.remove("m--active-slide", "m--previous-slide");
      if (prevBg) prevBg.classList.remove("m--active-nav-bg", "m--previous-nav-bg");

      if ($activeSlide) $activeSlide.classList.remove("m--before-sliding");
      if ($activeControlsBg) $activeControlsBg.classList.remove("m--nav-bg-before");
      if ($prevControl) {
        $prevControl.classList.remove("m--prev-control");
        $prevControl.classList.add("m--reset-progress");
        var triggerLayout = $prevControl.offsetTop;
        $prevControl.classList.remove("m--reset-progress");
      }
      sliding = false;
      if (autoSlidingActive && !autoSlidingBlocked) setAutoslidingTO();
    }

    function performSliding(slideID) {
      if (sliding) return;
      sliding = true;
      window.clearTimeout(autoSlidingTO);
      curSlide = slideID;

      $prevControl = $slider.querySelector(".m--active-control");
      if ($prevControl) $prevControl.classList.remove("m--active-control");
      $slider.querySelector(prefix + "nav__control-" + slideID).classList.add("m--active-control");

      $activeSlide = $slider.querySelector(prefix + "slide-" + slideID);
      $activeControlsBg = $slider.querySelector(prefix + "nav__bg-" + slideID);

      if ($activeSlide) $activeSlide.classList.add("m--active-slide");
      if ($activeControlsBg) $activeControlsBg.classList.add("m--active-nav-bg");

      setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
    }

    function controlClickHandler() {
      if (sliding || this.classList.contains("m--active-control")) return;
      if (options.blockASafterClick) autoSlidingBlocked = true;
      var slideID = +this.getAttribute("data-slide");
      performSliding(slideID);
    }

    $controls.forEach(function($control) {
      $control.addEventListener("click", controlClickHandler);
    });

    function setAutoslidingTO() {
      window.clearTimeout(autoSlidingTO);
      curSlide++;
      if (curSlide > numOfSlides) curSlide = 1;
      autoSlidingTO = setTimeout(function() { performSliding(curSlide); }, autoSlidingDelay);
    }

    if (options.autoSliding) {
      autoSlidingActive = true;
      setAutoslidingTO();
      $slider.classList.add("m--with-autosliding");
    }

    var $firstControl = $slider.querySelector(".fnc-nav__c
