(function() {
    var $$ = function(selector, context = document) {
        var elements = context.querySelectorAll(selector);
        return [].slice.call(elements);
    };

    function _fncSliderInit($slider, options) {
        var prefix = ".fnc-";

        var $slidesCont = $slider.querySelector(prefix + "slider__slides");
        if (!$slidesCont) {
            console.error("Error: Slider container not found", $slider);
            return;
        }

        var $slides = $$(prefix + "slide", $slider);
        var $controls = $$(prefix + "nav__control", $slider);
        var $controlsBgs = $$(prefix + "nav__bg", $slider);
        var $progressAS = $$(prefix + "nav__control-progress", $slider);

        var numOfSlides = $slides.length;
        var curSlide = 1;
        var sliding = false;

        var slidingAT = $slidesCont ? +parseFloat(getComputedStyle($slidesCont)["transition-duration"]) * 1000 : 300;
        var slidingDelay = $slidesCont ? +parseFloat(getComputedStyle($slidesCont)["transition-delay"]) * 1000 : 0;

        var autoSlidingActive = false;
        var autoSlidingTO;
        var autoSlidingDelay = 5000;
        var autoSlidingBlocked = false;

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
        };

        setIDs();

        function afterSlidingHandler() {
            var prevSlide = $slider.querySelector(".m--previous-slide");
            if (prevSlide) prevSlide.classList.remove("m--active-slide", "m--previous-slide");

            var prevBg = $slider.querySelector(".m--previous-nav-bg");
            if (prevBg) prevBg.classList.remove("m--active-nav-bg", "m--previous-nav-bg");

            sliding = false;
            if (autoSlidingActive && !autoSlidingBlocked) {
                setAutoslidingTO();
            }
        };

        function performSliding(slideID) {
            if (sliding) return;
            sliding = true;
            window.clearTimeout(autoSlidingTO);
            curSlide = slideID;

            var $prevControl = $slider.querySelector(".m--active-control");
            if ($prevControl) $prevControl.classList.remove("m--active-control");

            var $activeControl = $slider.querySelector(prefix + "nav__control-" + slideID);
            if ($activeControl) $activeControl.classList.add("m--active-control");

            var $activeSlide = $slider.querySelector(prefix + "slide-" + slideID);
            var $activeControlsBg = $slider.querySelector(prefix + "nav__bg-" + slideID);

            if ($activeSlide) $activeSlide.classList.add("m--active-slide");
            if ($activeControlsBg) $activeControlsBg.classList.add("m--active-nav-bg");

            setTimeout(afterSlidingHandler, slidingAT + slidingDelay);
        };

        function controlClickHandler() {
            if (sliding) return;
            if (this.classList.contains("m--active-control")) return;
            if (options.blockASafterClick) autoSlidingBlocked = true;

            var slideID = +this.getAttribute("data-slide");
            performSliding(slideID);
        };

        $controls.forEach(function($control) {
            $control.addEventListener("click", controlClickHandler);
        });

        function setAutoslidingTO() {
            window.clearTimeout(autoSlidingTO);
            curSlide = (curSlide % numOfSlides) + 1;
            autoSlidingTO = setTimeout(function() {
                performSliding(curSlide);
            }, autoSlidingDelay);
        };

        var firstControl = $slider.querySelector(".fnc-nav__control:first-child");
        if (firstControl) firstControl.classList.add("m--active-control");
    };

    var fncSlider = function(sliderSelector, options) {
        var $sliders = $$(sliderSelector);

        if ($sliders.length === 0) {
            console.error("No sliders found for selector:", sliderSelector);
            return;
        }

        $sliders.forEach(function($slider) {
            _fncSliderInit($slider, options);
        });
    };

    window.fncSlider = fncSlider;
})();

document.addEventListener("DOMContentLoaded", function () {
    fncSlider(".example-slider", { autoSlidingDelay: 4000 });
});
