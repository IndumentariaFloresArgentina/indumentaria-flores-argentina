const menuIcon = document.getElementById('menuIcon');
  const menuLinks = document.getElementById('menuLinks');

  menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('open');
    menuLinks.classList.toggle('active');
  });

Vue.config.devtools = true;

Vue.component("card", {
  template: `
    <div class="card-wrap"
      @mousemove="handleMouseMove"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      ref="card">
      <div class="card"
        :style="cardStyle">
        <div class="card-bg" :style="[cardBgTransform, cardBgImage]"></div>
        <div class="card-info">
          <slot name="header"></slot>
          <slot name="content"></slot>
        </div>
      </div>
    </div>`,
  mounted() {
    this.width = this.$refs.card.offsetWidth;
    this.height = this.$refs.card.offsetHeight;
  },
  props: ["dataImage"],
  data: () => ({
    width: 0,
    height: 0,
    mouseX: 0,
    mouseY: 0,
    mouseLeaveDelay: null
  }),
  computed: {
    mousePX() {
      return this.mouseX / this.width;
    },
    mousePY() {
      return this.mouseY / this.height;
    },
    cardStyle() {
      const rX = this.mousePX * 30;
      const rY = this.mousePY * -30;
      return {
        transform: `rotateY(${rX}deg) rotateX(${rY}deg)`
      };
    },
    cardBgTransform() {
      const tX = this.mousePX * -40;
      const tY = this.mousePY * -40;
      return {
        transform: `translateX(${tX}px) translateY(${tY}px)`
      };
    },
    cardBgImage() {
      return {
        backgroundImage: `url(${this.dataImage})`
      };
    }
  },
  methods: {
    handleMouseMove(e) {
      this.mouseX = e.pageX - this.$refs.card.offsetLeft - this.width / 2;
      this.mouseY = e.pageY - this.$refs.card.offsetTop - this.height / 2;
    },
    handleMouseEnter() {
      clearTimeout(this.mouseLeaveDelay);
    },
    handleMouseLeave() {
      this.mouseLeaveDelay = setTimeout(() => {
        this.mouseX = 0;
        this.mouseY = 0;
      }, 1000);
    }
  }
});

const app = new Vue({
  el: "#app"
});

$(function () {
  /** -----------------------------------------
	 * Modulo del Slider 
	 -------------------------------------------*/
  var SliderModule = (function () {
    var pb = {};
    pb.el = $("#slider");
    pb.items = {
      panels: pb.el.find(".slider-wrapper > li")
    };

    // Interval del Slider
    var SliderInterval,
      currentSlider = 0,
      nextSlider = 1,
      lengthSlider = pb.items.panels.length;

    // Constructor del Slider
    pb.init = function (settings) {
      this.settings = settings || { duration: 8000 };
      var items = this.items,
        lengthPanels = items.panels.length,
        output = "";

      // Insertamos nuestros botones
      for (var i = 0; i < lengthPanels; i++) {
        if (i == 0) {
          output += '<li class="active"></li>';
        } else {
          output += "<li></li>";
        }
      }

      $("#control-buttons").html(output);

      // Activamos nuestro Slider
      activateSlider();
      // Eventos para los controles
      $("#control-buttons").on("click", "li", function (e) {
        var $this = $(this);
        if (!(currentSlider === $this.index())) {
          changePanel($this.index());
        }
      });
    };

    // Funcion para activar el Slider
    var activateSlider = function () {
      SliderInterval = setInterval(pb.startSlider, pb.settings.duration);
    };

    // Funcion para la Animacion
    pb.startSlider = function () {
      var items = pb.items,
        controls = $("#control-buttons li");
      // Comprobamos si es el ultimo panel para reiniciar el conteo
      if (nextSlider >= lengthSlider) {
        nextSlider = 0;
        currentSlider = lengthSlider - 1;
      }

      controls.removeClass("active").eq(nextSlider).addClass("active");
      items.panels.eq(currentSlider).fadeOut("slow");
      items.panels.eq(nextSlider).fadeIn("slow");

      // Actualizamos los datos del slider
      currentSlider = nextSlider;
      nextSlider += 1;
    };

    // Funcion para Cambiar de Panel con Los Controles
    var changePanel = function (id) {
      clearInterval(SliderInterval);
      var items = pb.items,
        controls = $("#control-buttons li");
      // Comprobamos si el ID esta disponible entre los paneles
      if (id >= lengthSlider) {
        id = 0;
      } else if (id < 0) {
        id = lengthSlider - 1;
      }

      controls.removeClass("active").eq(id).addClass("active");
      items.panels.eq(currentSlider).fadeOut("slow");
      items.panels.eq(id).fadeIn("slow");

      // Volvemos a actualizar los datos del slider
      currentSlider = id;
      nextSlider = id + 1;
      // Reactivamos nuestro slider
      activateSlider();
    };

    return pb;
  })();

  SliderModule.init({ duration: 4000 });
});

// Mostrar/ocultar caption al hacer click
$('#slider .slider-wrapper li').on('click', function(e){
  e.stopPropagation();
  var $me = $(this);
  // quita la clase en los demás
  $('#slider .slider-wrapper li').not($me).removeClass('show-caption');
  // alterna en el actual
  $me.toggleClass('show-caption');
});


// FOOTER

// SCROLL TO TOP
document.getElementById('scrollTopBtn').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Pequeño aviso de "enviado" en el newsletter (simulación)
document.getElementById('newsletter-form').addEventListener('submit', e => {
  e.preventDefault();
  alert('¡Gracias por suscribirte!');
  e.target.reset();
});
