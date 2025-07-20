// Enhanced Cart Functionality for Menu Page with Custom Modals
class ShoppingCart {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.cartCount = 0;
        
        // DOM Elements
        this.cartDOM = document.querySelector('.cart-content');
        this.cartOverlay = document.querySelector('.cart-overlay');
        this.cartTotalValue = document.querySelector('.cart-total-value');
        this.cartCountEl = document.querySelector('.cart-count');
        this.checkoutBtn = document.querySelector('.checkout-btn');
        this.clearCartBtn = document.querySelector('.clear-cart-btn');
        this.successMessage = document.getElementById('successMessage');
        
        // Modal Elements
        this.confirmModal = document.getElementById('confirmModal');
        this.successModal = document.getElementById('successModal');
        this.clearCartModal = document.getElementById('clearCartModal');
        
        this.init();
    }
    
    init() {
        this.loadCart();
        this.renderCart();
        this.attachEventListeners();
        this.initMobileMenu();
        this.initModals();
    }
    
    initModals() {
        // Checkout Confirmation Modal
        const cancelCheckout = document.getElementById('cancelCheckout');
        const confirmCheckout = document.getElementById('confirmCheckout');
        
        if (cancelCheckout) {
            cancelCheckout.addEventListener('click', () => {
                this.hideModal(this.confirmModal);
            });
        }
        
        if (confirmCheckout) {
            confirmCheckout.addEventListener('click', () => {
                this.hideModal(this.confirmModal);
                this.processOrder();
            });
        }
        
        // Success Modal
        const closeSuccess = document.getElementById('closeSuccess');
        if (closeSuccess) {
            closeSuccess.addEventListener('click', () => {
                this.hideModal(this.successModal);
            });
        }
        
        // Clear Cart Modal
        const cancelClear = document.getElementById('cancelClear');
        const confirmClear = document.getElementById('confirmClear');
        
        if (cancelClear) {
            cancelClear.addEventListener('click', () => {
                this.hideModal(this.clearCartModal);
            });
        }
        
        if (confirmClear) {
            confirmClear.addEventListener('click', () => {
                this.hideModal(this.clearCartModal);
                this.performClearCart();
            });
        }
        
        // Close modals when clicking overlay
        [this.confirmModal, this.successModal, this.clearCartModal].forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal);
                    }
                });
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal(this.confirmModal);
                this.hideModal(this.successModal);
                this.hideModal(this.clearCartModal);
            }
        });
    }
    
    showModal(modal) {
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }
    
    hideModal(modal) {
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
    
    attachEventListeners() {
        // Cart toggle
        document.querySelector('.cart-icon')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showCart();
        });
        
        // Close cart
        document.querySelector('.close-cart')?.addEventListener('click', this.hideCart.bind(this));
        
        // Close cart when clicking overlay
        this.cartOverlay?.addEventListener('click', (e) => {
            if (e.target === this.cartOverlay) {
                this.hideCart();
            }
        });
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const name = button.dataset.name;
                const price = parseFloat(button.dataset.price);
                const image = button.dataset.image || 'images/default.jpg';
                
                this.addItem(name, price, image);
                this.showSuccessMessage(`${name} added to cart!`);
            });
        });
        
        // Checkout button
        this.checkoutBtn?.addEventListener('click', this.checkout.bind(this));
        
        // Clear cart button
        this.clearCartBtn?.addEventListener('click', this.clearCart.bind(this));
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideCart();
            }
        });
    }
    
    initMobileMenu() {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        
        burger?.addEventListener('click', () => {
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
    
    showCart() {
        this.cartOverlay?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    hideCart() {
        this.cartOverlay?.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    addItem(name, price, image = 'images/default.jpg') {
        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(item => item.name === name);
        
        if (existingItemIndex !== -1) {
            // Item exists, increase quantity
            this.cart[existingItemIndex].quantity += 1;
        } else {
            // New item, add to cart
            this.cart.push({
                id: Date.now(),
                name,
                price,
                image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.calculateTotal();
    }
    
    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.calculateTotal();
        this.showSuccessMessage('Item removed from cart!');
    }
    
    updateQuantity(id, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(id);
            return;
        }
        
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
            this.calculateTotal();
        }
    }
    
    calculateTotal() {
        this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (this.cartTotalValue) {
            this.cartTotalValue.textContent = `Rs. ${this.total.toFixed(0)}`;
        }
        
        // Enable/disable checkout button
        if (this.checkoutBtn) {
            this.checkoutBtn.disabled = this.cart.length === 0;
        }
    }
    
    updateCartCount() {
        this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCountEl) {
            this.cartCountEl.textContent = this.cartCount;
            this.cartCountEl.style.display = this.cartCount > 0 ? 'flex' : 'none';
        }
    }
    
    renderCart() {
        if (!this.cartDOM) return;
        
        if (this.cart.length === 0) {
            this.cartDOM.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <p>Add some delicious items to get started!</p>
                </div>
            `;
        } else {
            this.cartDOM.innerHTML = this.cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs. ${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add event listeners for quantity buttons and remove buttons
            this.attachCartItemListeners();
        }
        
        this.calculateTotal();
        this.updateCartCount();
    }
    
    attachCartItemListeners() {
        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = this.cart.find(item => item.id === id);
                if (item) {
                    this.updateQuantity(id, item.quantity + 1);
                }
            });
        });
        
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const item = this.cart.find(item => item.id === id);
                if (item && item.quantity > 1) {
                    this.updateQuantity(id, item.quantity - 1);
                }
            });
        });
        
        // Remove buttons
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.removeItem(id);
            });
        });
    }
    
    clearCart() {
        if (this.cart.length === 0) {
            this.showSuccessMessage('Cart is already empty!');
            return;
        }
        
        // Show clear cart confirmation modal
        this.showModal(this.clearCartModal);
    }
    
    performClearCart() {
        this.cart = [];
        this.saveCart();
        this.renderCart();
        this.updateCartCount();
        this.calculateTotal();
        this.showSuccessMessage('Cart cleared successfully!');
    }
    
    checkout() {
        if (this.cart.length === 0) {
            this.showSuccessMessage('Your cart is empty!');
            return;
        }
        
        // Update order summary in modal
        this.updateOrderSummary();
        
        // Show confirmation modal
        this.showModal(this.confirmModal);
    }
    
    updateOrderSummary() {
        const orderItemsContainer = document.getElementById('orderItems');
        const modalTotal = document.getElementById('modalTotal');
        
        if (orderItemsContainer) {
            orderItemsContainer.innerHTML = this.cart.map(item => `
                <div class="order-item">
                    <div class="order-item-details">
                        <div class="order-item-name">${item.name}</div>
                        <div class="order-item-quantity">Qty: ${item.quantity}</div>
                    </div>
                    <div class="order-item-price">Rs. ${(item.price * item.quantity).toFixed(0)}</div>
                </div>
            `).join('');
        }
        
        if (modalTotal) {
            modalTotal.textContent = `Rs. ${this.total.toFixed(0)}`;
        }
    }
    
    processOrder() {
        // Show loading state
        this.checkoutBtn.disabled = true;
        this.checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        
        // Simulate API call delay
        setTimeout(() => {
            // Generate order number
            const orderNumber = Math.floor(Math.random() * 10000) + 1000;
            
            // Update success modal content
            const orderNumberEl = document.getElementById('orderNumber');
            const successTotal = document.getElementById('successTotal');
            
            if (orderNumberEl) {
                orderNumberEl.textContent = `#${orderNumber}`;
            }
            
            if (successTotal) {
                successTotal.textContent = `Rs. ${this.total.toFixed(0)}`;
            }
            
            // Show success modal
            this.showModal(this.successModal);
            
            // Clear cart after successful order
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.updateCartCount();
            this.calculateTotal();
            
            // Hide cart
            this.hideCart();
            
            // Reset button
            this.checkoutBtn.innerHTML = 'Checkout';
            this.checkoutBtn.disabled = false;
            
            // Show success message
            setTimeout(() => {
                this.showSuccessMessage('Order placed successfully!');
            }, 1000);
        }, 2000);
    }
    
    saveCart() {
        // Since we can't use localStorage in Claude artifacts, we'll keep it in memory
        // In a real implementation, you would use:
        // localStorage.setItem('cart', JSON.stringify(this.cart));
        console.log('Cart saved:', this.cart);
    }
    
    loadCart() {
        // Since we can't use localStorage in Claude artifacts, we'll start with empty cart
        // In a real implementation, you would use:
        // const savedCart = localStorage.getItem('cart');
        // if (savedCart) {
        //     this.cart = JSON.parse(savedCart);
        // }
        this.cart = [];
    }
    
    showSuccessMessage(message) {
        if (!this.successMessage) return;
        
        // Update message content
        const messageText = this.successMessage.querySelector('h3');
        if (messageText) {
            messageText.textContent = message;
        }
        
        // Show message
        this.successMessage.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            this.successMessage.classList.remove('show');
        }, 3000);
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});