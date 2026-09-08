function renderCart(){
  var root=document.getElementById('cart-root');
  if(!root) return;
  var items=getCart();
  if(!items.length){root.innerHTML='<p class="muted">Your cart is empty.</p>';return;}
  var sub=items.reduce(function(s,i){return s+i.price*i.qty},0);
  root.innerHTML=items.map(function(i){
    return '<div class="cart-line"><img src="'+i.image+'" alt=""/><div style="flex:1"><div style="font-weight:500">'+i.title+'</div><div class="muted" style="font-size:.85rem;margin-top:.25rem">Qty '+i.qty+'</div><div style="margin-top:.35rem">'+money(i.price*i.qty)+'</div></div><button class="btn ghost" style="height:36px" type="button" onclick="removeItem(\''+i.slug+'\')">Remove</button></div>';
  }).join('')+'<div style="margin-top:1rem;display:flex;justify-content:space-between;font-weight:600"><span>Subtotal</span><span>'+money(sub)+'</span></div>';
}
function removeItem(slug){saveCart(getCart().filter(function(i){return i.slug!==slug}));renderCart()}
document.addEventListener('DOMContentLoaded',function(){
  renderCart();
  var btn=document.getElementById('checkout-btn');
  if(btn) btn.onclick=function(){ if(!getCart().length){toast('Cart is empty');return;} toast('Order intent captured — connect Razorpay for live payments'); };
});
