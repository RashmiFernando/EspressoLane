// Mobile menu toggle
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });

    // Form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if(name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
        document.getElementById('contactForm').reset();
    } else {
        alert('Please fill in all fields.');
    }
});

}

navSlide();

// Mobile menu toggle
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();

// Form submission
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    if(name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent. We'll get back to you soon.`);
        document.getElementById('contactForm').reset();
    } else {
        alert('Please fill in all fields.');
    }
});

// Cart functionality
class Cart {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.cartCount = 0;
        this.cartDOM = document.querySelector('.cart-content');
        this.cartOverlay = document.querySelector('.cart-overlay');
        this.cartTotalValue = document.querySelector('.cart-total-value');
        this.cartCountEl = document.querySelector('.cart-count');
        
        this.init();
    }
    
    init() {
        // Event listeners
        document.querySelector('.cart-icon')?.addEventListener('click', this.showCart.bind(this));
        document.querySelector('.close-cart')?.addEventListener('click', this.hideCart.bind(this));
        document.querySelector('.checkout-btn')?.addEventListener('click', this.checkout.bind(this));
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                this.addItem(name, price);
            });
        });
        
        this.loadCart();
        this.renderCart();
    }
    
    showCart() {
        this.cartOverlay.classList.add('show');
    }
    
    hideCart() {
        this.cartOverlay.classList.remove('show');
    }
    
    addItem(name, price) {
        // Check if item already exists in cart
        const existingItem = this.cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                name,
                price,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.showCart();
    }
    
    removeItem(name) {
        this.cart = this.cart.filter(item => item.name !== name);
        this.saveCart();
        this.renderCart();
    }
    
    updateQuantity(name, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(name);
            return;
        }
        
        const item = this.cart.find(item => item.name === name);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
        }
    }
    
    calculateTotal() {
        this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartCount = this.cart.reduce((count, item) => count + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('expressoCafeCart', JSON.stringify(this.cart));
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('expressoCafeCart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }
    
    renderCart() {
        this.calculateTotal();
        
        // Update cart count
        if (this.cartCountEl) {
            this.cartCountEl.textContent = this.cartCount;
        }
        
        // Update total
        if (this.cartTotalValue) {
            this.cartTotalValue.textContent = `Rs. ${this.total.toFixed(2)}`;
        }
        
        // Clear cart DOM
        if (this.cartDOM) {
            this.cartDOM.innerHTML = '';
            
            if (this.cart.length === 0) {
                this.cartDOM.innerHTML = '<p>Your cart is empty</p>';
                return;
            }
            
            this.cart.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.classList.add('cart-item');
                cartItemEl.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price.toFixed(2)}</div>
                        <button class="cart-item-remove">Remove</button>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase">+</button>
                    </div>
                `;
                
                this.cartDOM.appendChild(cartItemEl);
                
                // Add event listeners for quantity buttons
                cartItemEl.querySelector('.decrease').addEventListener('click', () => {
                    this.updateQuantity(item.name, item.quantity - 1);
                });
                
                cartItemEl.querySelector('.increase').addEventListener('click', () => {
                    this.updateQuantity(item.name, item.quantity + 1);
                });
                
                cartItemEl.querySelector('.cart-item-remove').addEventListener('click', () => {
                    this.removeItem(item.name);
                });
            });
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        const orderSummary = this.cart.map(item => 
            `${item.name} x${item.quantity} - Rs. ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        
        alert(`Order placed!\n\n${orderSummary}\n\nTotal: Rs. ${this.total.toFixed(2)}\n\nThank you for your order!`);
        
        // Clear cart
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.hideCart();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Cart();
});