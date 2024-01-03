'use strict'

class Filter {
    constructor(color, shape, elements, buttons, total) {
        this.color = document.querySelector(color);
        this.shape = document.querySelector(shape);
        this.elements = document.querySelector(elements);
        this.total = document.querySelector(total);
        this.buttons = document.querySelectorAll(buttons);
        this.data = [];
        this.color1 = '';
        this.shape1 = '';
    }

//fill
//
//
//

    get_json_fill() {
        fetch('pictures.json')
            .then(resp => resp.json())
            .then(resp => {
                this.data = resp;

                let circles = this.unique_shape('circle');
                let unique_circles = this.unique_color_obj(circles);
                this.filler_color(unique_circles);

                let silvers = this.unique_color('silver');
                this.filler_shape(silvers);

                this.fill_elements(this.data);

                this.total.textContent = this.elements.childNodes.length;
            })
    }
    unique_color_obj(arr) {
        const unique_obj = [];
        const unique_colors = [];

        arr.forEach(item => {
            if (!unique_colors.includes(item.color)) {
                unique_colors.push(item.color);
                unique_obj.push(item);
            }
        });

        return unique_obj;
    }
    unique_color(color) {
        return this.data.filter(item => item.color === color);
    }
    unique_shape(shape) {
        return this.data.filter(item => item.shape === shape);
    }
    filler_color(arr) {
        let arr_gen = arr.filter(elem => elem.color !== 'silver')
        arr_gen.forEach(elem => {
            let li = document.createElement('li');
            li.setAttribute('data-color', elem.color)
            li.innerHTML = `<img src="${elem.url}" alt="">`
            this.color.insertAdjacentElement('beforeend', li);
        });
    }
    filler_shape(arr) {
        arr.forEach(elem => {
            let li = document.createElement('li');
            li.classList.add(`elements_item--${elem.shape}`)
            li.setAttribute('data-shape', elem.shape)
            li.innerHTML = `<img src="${elem.url}" alt="">`
            this.shape.insertAdjacentElement('beforeend', li);
        });
    }

    fill_elements(arr) {
        this.elements.innerHTML = '';
        let arr_gen = arr.filter(elem => elem.color !== 'silver');
        arr_gen.forEach(elem => {
            let li = document.createElement('li');
            li.classList.add(`elements_item`)
            li.setAttribute('data-color', elem.color)
            li.setAttribute('data-shape', elem.shape)
            li.innerHTML = `<img src="${elem.url}" alt="">`
            this.elements.insertAdjacentElement('beforeend', li);
        });
    }

// filter
//
//
//

    filter_color(e) {
        if(e.target.localName === 'img') {
            this.color.childNodes.forEach(elem => {
                elem.children[0].classList.remove('active');
            });
            e.target.classList.add('active');
            this.color1 = e.target.parentElement.getAttribute('data-color');
        }
    }

    filter_shape(e) {
        if(e.target.localName === 'img') {
            this.shape.childNodes.forEach(elem => {
                elem.children[0].classList.remove('active');
            });
            e.target.classList.add('active');
            this.shape1 = e.target.parentElement.getAttribute('data-shape');
        }
    }

    filter_all() {
        if(this.color1 !== '' && this.shape1 !== '' ) {
            let col = this.data.filter(elem => elem.color === this.color1);
            let shap = col.filter(elem => elem.shape === this.shape1);
            this.fill_elements(shap);
        } else if (this.shape1 !== '') {
            let shap = this.data.filter(elem => elem.shape === this.shape1)
            this.fill_elements(shap);
        } else if (this.color1 !== '') {
            let col = this.data.filter(elem => elem.color === this.color1)
            this.fill_elements(col);
        }
        this.total.textContent = this.elements.childNodes.length;
    }

    cancel() {
        this.color.innerHTML = '';
        this.shape.innerHTML = '';
        this.elements.innerHTML = '';
        this.color1 = '';
        this.shape1 = '';
        this.get_json_fill();
    }

    init() {
        this.get_json_fill();
        this.color.addEventListener('click', this.filter_color.bind(this));
        this.shape.addEventListener('click', this.filter_shape.bind(this));
        this.buttons[0].addEventListener('click', this.filter_all.bind(this));
        this.buttons[1].addEventListener('click', this.cancel.bind(this));
    }
}