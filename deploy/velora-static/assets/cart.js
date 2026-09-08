const CART_KEY='velora_cart_v1';
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch(e){return []}}
function saveCart(items){localStorage.setItem(CART_KEY,JSON.stringify(items));updateCartCount()}
function updateCartCount(){const n=getCart().reduce((s,i)=>s+i.qty,0);document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=String(n)})}
function addToCart(product){const items=getCart();const ex=items.find(i=>i.slug===product.slug);if(ex)ex.qty+=1;else items.push({slug:product.slug,title:product.title,price:product.price,image:product.image,qty:1});saveCart(items);toast('Added to cart')}
function money(n){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
document.addEventListener('DOMContentLoaded',updateCartCount);
